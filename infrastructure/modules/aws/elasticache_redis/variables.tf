# General
# ===================================
variable "name" {
  type        = string
  description = "The name of the ElastiCache Redis cluster."
}

variable "vpc_id" {
  type        = string
  description = "The ID of the VPC where the ElastiCache cluster will be deployed."
}

variable "tags" {
  type        = map(string)
  description = "Tags to assign to resources."
}

# Security Group
# ===================================
variable "ingress_ports" {
  type = set(object({
    from_port       = number
    to_port         = number
    protocol        = string
    cidr_blocks     = list(string)
    security_groups = list(string)
  }))
  description = "Set of ingress rules for the ElastiCache security group."
  validation {
    condition     = length(var.ingress_ports) > 0
    error_message = "At least one ingress rule must be provided for Redis connectivity."
  }
}

variable "egress_ports" {
  type = set(object({
    from_port       = number
    to_port         = number
    protocol        = string
    cidr_blocks     = list(string)
    security_groups = list(string)
  }))
  description = "Set of egress rules for the ElastiCache security group."
}

# Subnet Group
# ===================================
variable "subnet_ids" {
  type        = set(string)
  description = "Set of private subnet IDs where ElastiCache will be deployed."
  validation {
    condition     = length(var.subnet_ids) > 0
    error_message = "At least one subnet ID must be provided."
  }
}

# ElastiCache Serverless
# ===================================
variable "max_data_storage_gb" {
  type        = number
  default     = 5
  description = "Maximum data storage in GB for the serverless cache."
  validation {
    condition     = var.max_data_storage_gb >= 1 && var.max_data_storage_gb <= 64
    error_message = "max_data_storage_gb must be between 1 and 64 GB."
  }
}

variable "max_ecpu_per_second" {
  type        = number
  default     = 1000
  description = "Maximum eCPU per second for the serverless cache."
  validation {
    condition     = var.max_ecpu_per_second >= 1000 && var.max_ecpu_per_second <= 400000
    error_message = "max_ecpu_per_second must be between 1000 and 400000."
  }
}

variable "daily_snapshot_time" {
  type        = string
  default     = "05:00"
  description = "The daily time for automatic snapshots (HH:MM UTC)."
  validation {
    condition     = can(regex("^([01][0-9]|2[0-3]):[0-5][0-9]$", var.daily_snapshot_time))
    error_message = "daily_snapshot_time must be in HH:MM format (00:00-23:59)."
  }
}

variable "snapshot_retention_limit" {
  type        = number
  default     = 7
  description = "The number of days to retain snapshots. Must be between 1 and 35 days."
  validation {
    condition     = var.snapshot_retention_limit >= 1 && var.snapshot_retention_limit <= 35
    error_message = "snapshot_retention_limit must be between 1 and 35 days."
  }
}
