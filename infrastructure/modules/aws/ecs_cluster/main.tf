# ECS Cluster
# ===================================
resource "aws_ecs_cluster" "this" {
  name = var.name

  configuration {
    execute_command_configuration {
      kms_key_id = var.enable_kms_encryption ? aws_kms_key.this[0].id : null
      logging    = "OVERRIDE"

      log_configuration {
        cloud_watch_encryption_enabled = var.enable_kms_encryption
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.this.name
      }
    }
  }

  setting {
    name  = "containerInsights"
    value = var.container_insights
  }

  tags = var.tags
}

# Security Group for ECS Tasks
# ===================================
resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.name}-ecs-tasks-"
  description = "Security group for ECS tasks in ${var.name}"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules
    content {
      from_port       = ingress.value.from_port
      to_port         = ingress.value.to_port
      protocol        = ingress.value.protocol
      cidr_blocks     = ingress.value.cidr_blocks
      security_groups = ingress.value.security_groups
    }
  }

  dynamic "egress" {
    for_each = var.egress_rules
    content {
      from_port       = egress.value.from_port
      to_port         = egress.value.to_port
      protocol        = egress.value.protocol
      cidr_blocks     = egress.value.cidr_blocks
      security_groups = egress.value.security_groups
    }
  }

  tags = var.tags
}

# CloudWatch Log Group
# ===================================
resource "aws_cloudwatch_log_group" "this" {
  name              = "/aws/ecs/cluster/${var.name}"
  retention_in_days = var.log_retention_in_days
  kms_key_id        = var.enable_kms_encryption ? aws_kms_key.this[0].arn : null
  tags              = var.tags
}

# KMS Key
# ===================================
resource "aws_kms_key" "this" {
  count                   = var.enable_kms_encryption ? 1 : 0
  description             = "KMS key for ECS ${var.name} CloudWatch and Exec encryption"
  enable_key_rotation     = true
  deletion_window_in_days = 7
  policy                  = var.enable_kms_encryption ? data.aws_iam_policy_document.kms_key_policy[0].json : null

  tags = merge(
    var.tags,
    {
      Name = "${var.name}-kms-key"
    }
  )
}

# KMS Key Policy - Allow root account and AWS services
# ===================================
data "aws_iam_policy_document" "kms_key_policy" {
  count = var.enable_kms_encryption ? 1 : 0

  statement {
    sid    = "Enable IAM Root Permissions"
    effect = "Allow"
    principals {
      type        = "AWS"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"]
    }
    actions   = ["kms:*"]
    resources = ["*"]
  }

  statement {
    sid    = "Allow CloudWatch Logs"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["logs.${var.region}.amazonaws.com"]
    }
    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey",
      "kms:GenerateDataKeyWithoutPlaintext",
      "kms:DescribeKey",
      "kms:Encrypt"
    ]
    resources = ["*"]
    condition {
      test     = "ArnLike"
      variable = "kms:EncryptionContext:aws:logs:arn"
      values   = ["arn:aws:logs:${var.region}:${data.aws_caller_identity.current.account_id}:log-group:/aws/ecs/cluster/${var.name}"]
    }
  }

  statement {
    sid    = "Allow ECS Tasks"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey",
      "kms:DescribeKey"
    ]
    resources = ["*"]
  }
}

# Data source for current AWS account
# ===================================
data "aws_caller_identity" "current" {}


resource "aws_kms_alias" "this" {
  count         = var.enable_kms_encryption ? 1 : 0
  name          = "alias/${var.name}-ecs-key"
  target_key_id = aws_kms_key.this[0].key_id
}
