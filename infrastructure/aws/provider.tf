terraform {
  required_version = ">=1.14.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "6.0.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      "managed-by" = "terraform",
      "project"     = "expense-tracker",
    }
  }
}
