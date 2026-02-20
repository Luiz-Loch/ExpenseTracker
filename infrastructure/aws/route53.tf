# ============================
# Route 53 - Hosted Zone
# ============================

module "route53_hosted_zone" {
  source      = "../modules/aws/route53_hosted_zone"
  domain_name = local.public_domain
  comment     = "Hosted zone for Expense Tracker"
  tags        = local.tags
}

# ============================
# Route 53 - DNS Records
# ============================

# Apex domain (`route53_hosted_zone.domain_name`) -> EC2 instance
module "route53_record_apex" {
  source  = "../modules/aws/route53_record"
  zone_id = module.route53_hosted_zone.zone_id
  name    = "" # apex (root domain)
  type    = "A"
  ttl     = 300
  records = [module.ec2.public_ip]
}

# Apex domain (`route53_hosted_zone.domain_name`) -> EC2 instance
module "route53_record_www" {
  source  = "../modules/aws/route53_record"
  zone_id = module.route53_hosted_zone.zone_id
  name    = "www" # www subdomain
  type    = "A"
  ttl     = 300
  records = [module.ec2.public_ip]
}


# Apex domain (`route53_hosted_zone.domain_name`) -> ALB
# module "route53_record_apex" {
#   source  = "../modules/aws/route53_record"
#   zone_id = module.route53_hosted_zone.zone_id
#   name    = "" # apex (root domain)
#   type    = "A"

#   alias = {
#     name    = module.load_balancer.alb_dns_name
#     zone_id = module.load_balancer.alb_zone_id
#   }
# }

# # API subdomain (`api.${route53_hosted_zone.domain_name}`) -> ALB
# module "route53_record_api" {
#   source  = "../modules/aws/route53_record"
#   zone_id = module.route53_hosted_zone.zone_id
#   name    = "api"
#   type    = "A"

#   alias = {
#     name    = module.load_balancer.alb_dns_name
#     zone_id = module.load_balancer.alb_zone_id
#   }
# }
