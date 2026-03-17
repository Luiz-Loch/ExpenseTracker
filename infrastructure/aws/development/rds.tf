# RDS PostgreSQL Database
# ===================================
module "rds_postgresql" {
  source = "../../modules/aws/rds_postgresql"

  name                                  = "${local.name}-${local.environment}-rds-postgresql"
  vpc_id                                = module.vpc.id
  db_name                               = "expensetracker"
  instance_class                        = "db.t3.micro"
  engine_version                        = "18.3"
  auto_minor_version_upgrade            = true
  username                              = "postgres"
  password                              = module.backend_secret_db_password.value
  allocated_storage                     = 20
  max_allocated_storage                 = 50
  storage_type                          = "gp3"
  iops                                  = 3000
  storage_encrypted                     = true
  backup_retention_period               = 7
  skip_final_snapshot                   = false
  deletion_protection                   = false
  performance_insights_enabled          = false
  performance_insights_retention_period = null
  monitoring_interval                   = 1     # Disable enhanced monitoring
  publicly_accessible                   = false # Private DB instance

  # Security Group - Allow ECS tasks to connect to the database
  db_ingress_ports = [
    {
      from_port = 5432
      to_port   = 5432
      protocol  = "tcp"
      cidr_blocks = [
        module.vpc_subnet_1_private.cidr_block,
        module.vpc_subnet_2_private.cidr_block,
      ] # Private subnets CIDR blocks
      security_groups = []
    }
  ]

  db_egress_ports = [
    {
      from_port       = 0
      to_port         = 65535
      protocol        = "tcp"
      cidr_blocks     = ["0.0.0.0/0"]
      security_groups = []
    }
  ]

  # Subnet Group - Use private subnets
  subnet_ids = [
    module.vpc_subnet_1_private.id,
    module.vpc_subnet_2_private.id
  ]

  tags = local.tags
}
