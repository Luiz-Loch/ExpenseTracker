locals {
  name          = "expense-tracker"
  region        = "us-east-1"
  public_domain = "expense-tracker.link"
  environment   = "dev"
  tags = {
    "managed-by" = "terraform",
    "project"    = "expense-tracker",
  }
}
