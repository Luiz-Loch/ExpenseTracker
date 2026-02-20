output "fqdn" {
  description = "The FQDN built from the zone domain and record name"
  value       = aws_route53_record.this.fqdn
}

output "name" {
  description = "The name of the record"
  value       = aws_route53_record.this.name
}
