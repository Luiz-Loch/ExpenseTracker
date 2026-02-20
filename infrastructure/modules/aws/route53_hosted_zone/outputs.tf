output "zone_id" {
  description = "The hosted zone ID"
  value       = aws_route53_zone.this.zone_id
}

output "name_servers" {
  description = "A list of name servers in associated delegation set"
  value       = aws_route53_zone.this.name_servers
}

output "name" {
  description = "The domain name of the hosted zone"
  value       = aws_route53_zone.this.name
}

output "arn" {
  description = "The ARN of the hosted zone"
  value       = aws_route53_zone.this.arn
}
