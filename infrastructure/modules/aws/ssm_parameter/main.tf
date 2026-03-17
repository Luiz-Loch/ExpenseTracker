# AWS Systems Manager Parameter Store Module
# ===================================
resource "random_string" "this" {
  length  = var.password_length
  special = true
}

resource "aws_ssm_parameter" "this" {
  name  = var.name
  type  = var.parameter_type
  value = var.value != "" ? var.value : random_string.this.result
  tags  = var.tags

  lifecycle {
    ignore_changes = [value]
  }
}
