locals {
  name   = "tf-expense-tracker"
  region = "us-east-1"
  domain = "expense-tracker.link"
  tags = {
    "managed-by" = "terraform",
    "project"     = "expense-tracker",
  }
}
