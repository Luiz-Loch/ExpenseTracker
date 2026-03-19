locals {
  parameter_value = var.generate_password ? random_password.this[0].result : var.value
}
