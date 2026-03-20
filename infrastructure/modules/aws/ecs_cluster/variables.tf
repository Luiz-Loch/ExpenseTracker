variable "name" {
  description = "The name of the ECS cluster"
  type        = string
}

variable "region" {
  description = "AWS region"
  type        = string
}

variable "vpc_id" {
  description = "The VPC ID where the security group will be created"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the ECS cluster"
  type        = map(string)
}

# Security Group Rules
# ===================================
variable "ingress_rules" {
  description = "List of ingress rules for the ECS tasks security group"
  type = list(object({
    from_port       = number
    to_port         = number
    protocol        = string
    cidr_blocks     = optional(list(string), [])
    security_groups = optional(list(string), [])
  }))
  default = []
}

variable "egress_rules" {
  description = "List of egress rules for the ECS tasks security group"
  type = list(object({
    from_port   = number
    to_port     = number
    protocol    = string
    cidr_blocks = list(string)
    security_groups = optional(list(string), [])
  }))
  default = [
    {
      from_port   = 0
      to_port     = 0
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
      security_groups = []
    }
  ]
}

# ECS Cluster
# ===================================
variable "container_insights" {
  description = "Enable or disable container insights for the ECS cluster. Options are 'enabled', 'disabled', or 'enhanced'."
  type        = string
  default     = "enhanced"
  validation {
    condition     = contains(["enabled", "disabled", "enhanced"], var.container_insights)
    error_message = "container_insights must be one of 'enabled', 'disabled', or 'enhanced'."
  }
}

# CloudWatch Log Group
# ===================================
variable "log_retention_in_days" {
  description = "The number of days to retain log events in the specified log group."
  type        = number
  default     = 30
}

# KMS Encryption
# ===================================
variable "enable_kms_encryption" {
  description = "Enable KMS encryption for CloudWatch and ECS Exec logs"
  type        = bool
  default     = true
}
