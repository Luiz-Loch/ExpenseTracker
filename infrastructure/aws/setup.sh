#!/usr/bin/env bash
set -euo pipefail

# ===========================================
# EC2 User Data - ExpenseTracker Setup
# ===========================================

LOG_FILE="/var/log/setup.log"
exec > >(tee -a "$LOG_FILE") 2>&1
echo "=== Setup started at $(date) ==="

# -------------------------------------------
# 1. System update
# -------------------------------------------
apt-get update -y
apt-get upgrade -y

# -------------------------------------------
# 2. Install Docker
# -------------------------------------------
apt-get install -y ca-certificates curl gnupg

install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

systemctl enable docker
systemctl start docker

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# -------------------------------------------
# 3. Install Git
# -------------------------------------------
apt-get install -y git

# -------------------------------------------
# 4. Clone repository
# -------------------------------------------
APP_DIR="/home/ubuntu/ExpenseTracker"

git clone https://github.com/Luiz-Loch/ExpenseTracker.git "$APP_DIR"
chown -R ubuntu:ubuntu "$APP_DIR"

# -------------------------------------------
# 5. Create .env file
# -------------------------------------------

# Get EC2 public IP (IMDSv2)
IMDS_TOKEN="$(curl -sS -X PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")"

EC2_PUBLIC_IP="$(curl -sS -H "X-aws-ec2-metadata-token: $IMDS_TOKEN" \
  "http://169.254.169.254/latest/meta-data/public-ipv4" || true)"

if [[ -z "${EC2_PUBLIC_IP}" ]]; then
  echo "ERROR: Could not fetch EC2 public IPv4. Is this instance in a public subnet with a public IPv4/EIP?"
  exit 1
fi

echo "EC2 public IP detected: ${EC2_PUBLIC_IP}"

cat > "$APP_DIR/.env" <<ENV
# BACKEND CONFIGURATION

## DATABASE CONFIGURATION
PG_USERNAME=root
PG_PASSWORD=root_password
PG_DATABASE=expense-tracker
PG_PORT=5432
PG_HOST=postgres

## APLICATION CONFIGURATION
PORT=8080
FRONTEND_HOST=${EC2_PUBLIC_IP}
FRONTEND_PORT=3000

### AUTHENTICATION CONFIGURATION
JWT_SECRET_KEY=your_jwt_secret_key
HASH_SALT_ROUNDS=10

# FRONTEND CONFIGURATION

## APPLICATION CONFIGURATION
BACKEND_HOST=${EC2_PUBLIC_IP}

# COMPOSE CONFIGURATION
COMPOSE_BACKEND_PORT=8080
COMPOSE_FRONTEND_PORT=3000
ENV

chown ubuntu:ubuntu "$APP_DIR/.env"

# -------------------------------------------
# 6. Start application
# -------------------------------------------
cd "$APP_DIR"
docker compose up -d --build

echo "=== Setup completed at $(date) ==="
