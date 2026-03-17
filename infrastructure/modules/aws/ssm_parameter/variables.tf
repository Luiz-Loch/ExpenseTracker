variable "name" {
  description = "The name of the parameter (e.g., /app/db-host)"
  type        = string
}

variable "password_length" {
  description = "Length of the random password to generate if value is not provided"
  type        = number
  default     = 32
  
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

variable "value" {
  description = "The value of the parameter. If empty, a random string (32 chars) will be generated"
  type        = string
  sensitive   = true
  default     = ""
}

variable "tags" {
  description = "Tags to assign to the parameter"
  type        = map(string)
}
