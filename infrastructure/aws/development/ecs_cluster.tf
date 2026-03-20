# ECS Cluster
# ===================================
module "ecs_cluster" {
  source = "../../modules/aws/ecs_cluster"

  name                  = "${local.name}-${local.environment}-ecs-cluster"
  region                = local.region
  vpc_id                = module.vpc.id
  container_insights    = "enhanced"
  log_retention_in_days = 30
  enable_kms_encryption = false

  # Ingress rules - Allow traffic from ALB and within VPC
  ingress_rules = [
    {
      from_port       = 3000
      to_port         = 3000
      protocol        = "tcp"
      cidr_blocks     = [module.vpc.cidr_block]
      security_groups = []
    },
    {
      from_port       = 8080
      to_port         = 8080
      protocol        = "tcp"
      cidr_blocks     = [module.vpc.cidr_block]
      security_groups = []
    }
  ]

  # Egress rules - Allow all outbound traffic
  egress_rules = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
    }
  ]

  tags = local.tags
}
