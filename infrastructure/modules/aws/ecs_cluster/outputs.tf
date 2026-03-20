# ECS Cluster
# ===================================
output "cluster_id" {
  description = "The ID of the ECS Cluster"
  value       = aws_ecs_cluster.this.id
}

output "cluster_arn" {
  description = "The ARN of the ECS Cluster"
  value       = aws_ecs_cluster.this.arn
}

output "cluster_name" {
  description = "The name of the ECS Cluster"
  value       = aws_ecs_cluster.this.name
}

# Security Group
# ===================================
output "security_group_id" {
  description = "The ID of the ECS tasks security group"
  value       = aws_security_group.ecs_tasks.id
}

output "security_group_arn" {
  description = "The ARN of the ECS tasks security group"
  value       = aws_security_group.ecs_tasks.arn
}

# CloudWatch Logs
# ===================================
output "log_group_name" {
  description = "The name of the CloudWatch log group for ECS cluster"
  value       = aws_cloudwatch_log_group.this.name
}

output "log_group_arn" {
  description = "The ARN of the CloudWatch log group for ECS cluster"
  value       = aws_cloudwatch_log_group.this.arn
}

# KMS Encryption
# ===================================
output "kms_key_id" {
  description = "The ID of the KMS key used for encryption (null if disabled)"
  value       = var.enable_kms_encryption ? aws_kms_key.this[0].id : null
}

output "kms_key_arn" {
  description = "The ARN of the KMS key used for encryption (null if disabled)"
  value       = var.enable_kms_encryption ? aws_kms_key.this[0].arn : null
}

