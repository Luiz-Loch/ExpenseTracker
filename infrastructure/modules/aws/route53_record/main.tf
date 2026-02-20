resource "aws_route53_record" "this" {
  zone_id = var.zone_id
  name    = var.name
  type    = var.type

  # Standard record (IP, CNAME value, etc.)
  ttl     = var.alias == null ? var.ttl : null
  records = var.alias == null ? var.records : null

  # Alias record (ALB, CloudFront, S3, etc.)
  dynamic "alias" {
    for_each = var.alias != null ? [var.alias] : []

    content {
      name                   = alias.value.name
      zone_id                = alias.value.zone_id
      evaluate_target_health = alias.value.evaluate_target_health
    }
  }
}
