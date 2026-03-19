output "endpoint" {
  value       = aws_elasticache_serverless_cache.this.endpoint[0].address
  description = "The endpoint address of the ElastiCache Redis cluster."
}

output "port" {
  value       = aws_elasticache_serverless_cache.this.endpoint[0].port
  description = "The port of the ElastiCache Redis cluster."
}
