variable "name" {
  description = "The name of the parameter (e.g., /app/db-host)"
  type        = string
}

variable "password_length" {
  description = "Length of the random password to generate when value is not provided"
  type        = number
  default     = 128
}

variable "special" {
  description = "Whether to include special characters in the generated password"
  type = bool
  default = true
}

variable "parameter_type" {
  description = "The type of the parameter (String, StringList, or SecureString)"
  type        = string
  default     = "String"
  validation {
    condition     = contains(["String", "StringList", "SecureString"], var.parameter_type)
    error_message = "Parameter type must be String, StringList, or SecureString."
  }
}

variable "generate_password" {
  description = "Whether to generate a random password. If false, value must be provided"
  type        = bool
  default     = false
}

variable "value" {
  description = "The value of the parameter. If generate_password is true, this is ignored"
  type        = string
  sensitive   = true
  default     = null
}

variable "tags" {
  description = "Tags to assign to the parameter"
  type        = map(string)
}
