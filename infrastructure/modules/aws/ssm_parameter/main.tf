# AWS Systems Manager Parameter Store Module
# ===================================
resource "random_password" "this" {
  count  = var.generate_password ? 1 : 0

  length  = var.password_length
  special = var.special
  override_special = "!@#$%&-"
}

resource "aws_ssm_parameter" "this" {
  name  = var.name
  type  = var.parameter_type
  value = local.parameter_value
  tags  = var.tags

  lifecycle {
    ignore_changes = [value]
  }
}
