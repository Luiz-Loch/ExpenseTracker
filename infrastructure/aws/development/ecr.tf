# ECR Registry for Frontend
# ===================================
module "ecr_frontend" {
  source                  = "../../modules/aws/ecr"
  name                    = "${local.name}-${local.environment}-ecr-frontend"
  image_tag_mutability    = "MUTABLE"
  scan_on_push            = true
  force_delete            = true
  retention_tag_prefix    = "prod"
  retention_period_days   = 30
  tags                    = local.tags
}

# ECR Registry for Backend
# ===================================
module "ecr_backend" {
  source                  = "../../modules/aws/ecr"
  name                    = "${local.name}-${local.environment}-ecr-backend"
  image_tag_mutability    = "MUTABLE"
  scan_on_push            = true
  force_delete            = true
  retention_tag_prefix    = "prod"
  retention_period_days   = 30
  tags                    = local.tags
}
