# # Load Balancer
# # ===================================================
# module "load_balancer" {
#   source = "../modules/aws/load_balancer"
#   name   = "${local.name}-alb"
#   vpc_id = module.vpc.id

#   # Public subnets for the ALB
#   subnets = [
#     module.vpc_subnet_1_public.id,
#     module.vpc_subnet_2_public.id
#   ]
#   # ingress ports to allow HTTP and HTTPS traffic
#   ingress_ports = [
#     {
#       from_port   = 80
#       to_port     = 80
#       protocol    = "tcp"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#     {
#       from_port   = 443
#       to_port     = 443
#       protocol    = "tcp"
#       cidr_blocks = ["0.0.0.0/0"]
#     }
#   ]

#   # egress ports to allow all outbound traffic
#   egress_ports = [
#     {
#       from_port   = 0
#       to_port     = 0
#       protocol    = "-1"
#       cidr_blocks = ["0.0.0.0/0"]
#     },
#   ]

#   # Target groups
#   target_groups = {
#     app = {
#       load_balancing_algorithm_type = "round_robin"
#       port                          = 3000
#       path                          = "/*"
#       protocol                      = "HTTP"
#       target_type                   = "instance"
#       health_check = {
#         enabled             = true
#         healthy_threshold   = 3
#         interval            = 30
#         path                = "/"
#         port                = "traffic-port"
#         timeout             = 5
#         unhealthy_threshold = 3
#       }
#     }
#     api = {
#       load_balancing_algorithm_type = "round_robin"
#       port                          = 8080
#       path                          = "/api/*"
#       protocol                      = "HTTP"
#       target_type                   = "instance"
#       health_check = {
#         enabled             = true
#         healthy_threshold   = 3
#         interval            = 30
#         path                = "/health"
#         port                = "traffic-port"
#         timeout             = 5
#         unhealthy_threshold = 3
#       }
#     }
#   }

#   # HTTPS (opcional — requer certificado ACM)
#   # enable_https_listener = true
#   # certificate_arn       = "arn:aws:acm:us-east-1:123456789:certificate/xxx"

#   tags = local.tags
# }

# resource "aws_lb_target_group_attachment" "backend" {
#   target_group_arn = module.load_balancer.target_group_arns["api"]
#   target_id        = module.ec2.instance_id
#   port             = 8080
# }

# resource "aws_lb_target_group_attachment" "frontend" {
#   target_group_arn = module.load_balancer.target_group_arns["app"]
#   target_id        = module.ec2.instance_id
#   port             = 3000
# }