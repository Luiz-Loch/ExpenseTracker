output "arn" {
  description = "The ARN of the parameter"
  value       = aws_ssm_parameter.this.arn
}

output "name" {
  description = "The name of the parameter"
  value       = aws_ssm_parameter.this.name
}

output "value" {
  description = "The value of the parameter"
  value       = aws_ssm_parameter.this.value
  sensitive   = true
}

output "is_generated" {
  description = "Whether the value was auto-generated (true) or provided (false)"
  value       = var.value == ""
}
