# ============================================================================
# SECRETS (sensitive data - SecureString type)
# ============================================================================

module "backend_secret_db_password" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/backend/secrets/db_password"
  parameter_type = "SecureString"
  tags           = local.tags
}

module "backend_secret_jwt_secret_key" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/backend/secrets/jwt_secret_key"
  parameter_type = "SecureString"
  tags           = local.tags
}

# ============================================================================
# CONFIGURATION (non-sensitive - String type)
# ============================================================================

# Frontend Configuration
module "frontend_config_backend_endpoint" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/frontend/config/backend_endpoint"
  parameter_type = "String"
  value          = "https://api.${local.public_domain}"
  tags           = local.tags
}

# Backend - Server Configuration
module "backend_config_port" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/backend/config/port"
  parameter_type = "String"
  value          = "8080"
  tags           = local.tags
}

module "backend_config_hash_salt_rounds" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/backend/config/hash_salt_rounds"
  parameter_type = "String"
  value          = "10"
  tags           = local.tags
}

# Backend - Frontend URL (for CORS)
module "backend_config_frontend_endpoint" {
  source         = "../../modules/aws/ssm_parameter"
  name           = "/${local.environment}/backend/config/frontend_endpoint"
  parameter_type = "String"
  value          = "https://${local.public_domain}"
  tags           = local.tags
}

# # Backend - Redis Configuration
# module "backend_config_redis_host" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/redis_host"
#   parameter_type = "String"
#   value          = module.elasticache_redis.endpoint
#   tags           = local.tags
# }

# module "backend_config_redis_port" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/redis_port"
#   parameter_type = "String"
#   value          = tostring(module.elasticache_redis.port)
#   tags           = local.tags
# }

# # Backend - Database Configuration
# module "backend_config_pg_host" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/pg_host"
#   parameter_type = "String"
#   value          = module.rds_postgresql.address
#   tags           = local.tags
# }

# module "backend_config_pg_port" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/pg_port"
#   parameter_type = "String"
#   value          = tostring(module.rds_postgresql.port)
#   tags           = local.tags
# }

# module "backend_config_pg_database" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/pg_database"
#   parameter_type = "String"
#   value          = module.rds_postgresql.db_name
#   tags           = local.tags
# }

# module "backend_config_pg_username" {
#   source         = "../../modules/aws/ssm_parameter"
#   name           = "/${local.environment}/backend/config/pg_username"
#   parameter_type = "String"
#   value          = module.rds_postgresql.username
#   tags           = local.tags
# }
