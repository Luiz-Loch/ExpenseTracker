# AWS Key Pair
# ===================================================
resource "aws_key_pair" "this" {
  key_name   = "${local.name}-aws-key"
  public_key = file("~/.ssh/tf-expense-tracker-key.pub")
  tags       = local.tags
}

# EC2 Instance
# ===================================================
# module "ec2" {
#   source        = "../modules/aws/ec2"
#   name          = "${local.name}-ec2"
#   vpc_id        = module.vpc.id
#   subnet_id     = module.vpc_subnet_1_public.id
#   image_id      = "ami-0b6c6ebed2801a5cb" # Canonical, Ubuntu, 24.04, amd64 noble image us-east-1
#   instance_type = "t3.small"
#   key_name      = aws_key_pair.this.key_name

#   associate_public_ip_address = true
#   monitoring                  = false
#   volume_size                 = 20
#   volume_type                 = "gp3"
#   elastic_ip                  = true

#   user_data = file("./setup.sh")

#   ingress_ports = [
#     {
#       from_port   = 22
#       to_port     = 22
#       protocol    = "tcp"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#     {
#       from_port   = 4000
#       to_port     = 4000
#       protocol    = "tcp"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#     {
#       from_port   = 3000
#       to_port     = 3000
#       protocol    = "tcp"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#   ]

#   egress_ports = [
#     {
#       from_port   = 0
#       to_port     = 0
#       protocol    = "-1"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#   ]

#   iam_policy_arns = {
#     "ec2-read-only" = "arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess"
#     "cloudwatch"    = "arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy"
#     "ssm"           = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
#   }

#   tags = local.tags
# }
