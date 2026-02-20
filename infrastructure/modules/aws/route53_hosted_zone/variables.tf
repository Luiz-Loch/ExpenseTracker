variable "domain_name" {
  description = "The domain name for the hosted zone (e.g. example.com)"
  type        = string

  validation {
    condition     = can(regex("^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(\\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?)*\\.[a-zA-Z]{2,}$", var.domain_name))
    error_message = "The domain_name must be a valid domain (e.g. example.com)."
  }
}

variable "comment" {
  description = "A comment for the hosted zone"
  type        = string
  default     = "Managed by Terraform"
}

variable "force_destroy" {
  description = "Whether to destroy all records in the zone when destroying the zone"
  type        = bool
  default     = false
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}
