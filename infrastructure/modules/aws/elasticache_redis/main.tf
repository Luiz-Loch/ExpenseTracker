# ElastiCache Redis Security Group
# ===================================
resource "aws_security_group" "this" {
  name        = "${var.name}-redis-sg"
  description = "Allow traffic for ElastiCache Redis"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_ports
    content {
      from_port       = ingress.value.from_port
      to_port         = ingress.value.to_port
      protocol        = ingress.value.protocol
      cidr_blocks     = ingress.value.cidr_blocks
      security_groups = ingress.value.security_groups
    }
  }

  dynamic "egress" {
    for_each = var.egress_ports
    content {
      from_port       = egress.value.from_port
      to_port         = egress.value.to_port
      protocol        = egress.value.protocol
      cidr_blocks     = egress.value.cidr_blocks
      security_groups = egress.value.security_groups
    }
  }

  tags = merge(var.tags, { "Name" = "${var.name}-redis-sg" })
}

# ElastiCache Subnet Group
# ===================================
resource "aws_elasticache_subnet_group" "this" {
  name        = "${var.name}-redis-subnet-group"
  subnet_ids  = var.subnet_ids
  description = "Subnet group for ${var.name}"
  tags        = merge(var.tags, { "Name" = "${var.name}-redis-subnet-group" })
}

# ElastiCache Redis Serverless
# ===================================
resource "aws_elasticache_serverless_cache" "this" {
  engine = "redis"
  name   = var.name

  cache_usage_limits {
    data_storage {
      maximum = var.max_data_storage_gb
      unit    = "GB"
    }
    ecpu_per_second {
      maximum = var.max_ecpu_per_second
    }
  }

  daily_snapshot_time      = var.daily_snapshot_time
  snapshot_retention_limit = var.snapshot_retention_limit
  security_group_ids       = [aws_security_group.this.id]
  subnet_ids               = var.subnet_ids

  tags = merge(var.tags, { "Name" = var.name })
}
