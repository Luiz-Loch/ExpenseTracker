# AWS Systems Manager Parameter Store Module
# ===================================
resource "random_password" "this" {
  count   = var.value == "" ? 1 : 0
  length  = var.password_length
  special = var.special

  override_special = "!@#$%&-"
}

resource "aws_ssm_parameter" "this" {
  name  = var.name
  type  = var.parameter_type
  value = var.value != "" ? var.value : random_password.this[0].result
  tags  = var.tags

  lifecycle {
    ignore_changes = [value]
  }
}
