module "elasticache_redis" {
  source = "../../modules/aws/elasticache_redis"

  name   = "${local.name}-${local.environment}-redis"
  vpc_id = module.vpc.id

  # Serverless limits
  max_data_storage_gb = 1
  max_ecpu_per_second = 1000

  # Snapshots
  daily_snapshot_time      = "05:00"
  snapshot_retention_limit = 7

  # Security Group - Allow ECS tasks to connect to Redis
  ingress_ports = [
    {
      from_port   = 6379
      to_port     = 6379
      protocol    = "tcp"
      cidr_blocks = [
        module.vpc_subnet_1_private.cidr_block,
        module.vpc_subnet_2_private.cidr_block,
      ]
      security_groups = [
      ]
    }
  ]

  egress_ports = [
    {
      from_port       = 0
      to_port         = 65535
      protocol        = "tcp"
      cidr_blocks     = ["0.0.0.0/0"]
      security_groups = [
      ]
    }
  ]

  # Subnet Group - Use private subnets
  subnet_ids = [
    module.vpc_subnet_1_private.id,
    module.vpc_subnet_2_private.id
  ]

  tags = local.tags
}
