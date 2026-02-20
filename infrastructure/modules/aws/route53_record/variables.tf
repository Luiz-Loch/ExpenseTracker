variable "zone_id" {
  description = "The ID of the hosted zone to contain the record"
  type        = string
}

variable "name" {
  description = "The name of the record (e.g. www, api, or empty string for apex)"
  type        = string
}

variable "type" {
  description = "The record type (A, AAAA, CNAME, MX, TXT, etc.)"
  type        = string

  validation {
    condition     = contains(["A", "AAAA", "CNAME", "MX", "NS", "TXT", "SRV", "SOA", "CAA"], var.type)
    error_message = "The type must be one of: A, AAAA, CNAME, MX, NS, TXT, SRV, SOA, CAA."
  }
}

variable "ttl" {
  description = "The TTL of the record in seconds. Ignored when alias is configured."
  type        = number
  default     = null
}

variable "records" {
  description = "A list of records (e.g. IP addresses for A records). Ignored when alias is configured."
  type        = list(string)
  default     = null
}

variable "alias" {
  description = "An alias block for routing to AWS resources (e.g. ALB, CloudFront). When set, ttl and records are ignored."
  type = object({
    name                   = string
    zone_id                = string
    evaluate_target_health = optional(bool, true)
  })
  default = null
}
