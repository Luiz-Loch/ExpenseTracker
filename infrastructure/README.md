# Infraestrutura do ExpenseTracker

Este diretório contém a infraestrutura como código (IaC) do projeto ExpenseTracker, utilizando Terraform para provisionamento na AWS.

## Recursos Provisionados

- **VPC (Virtual Private Cloud):**
   - Rede isolada para os recursos do projeto.
   - Sub-redes públicas e privadas para segmentação e segurança.

- **Subnets:**
   - Duas subnets públicas (alta disponibilidade).
   - Subnets privadas para recursos internos.

- **Instância EC2:**
   - Servidor Ubuntu configurado via script (`setup.sh`).
   - Instalação automática do Docker e dependências.
   - Chave SSH gerenciada via Terraform.

- **Route53 (DNS):**
   - Zona hospedada para o domínio principal (`expense-tracker.link`).
   - Registros A para domínio raiz e www, apontando para a EC2.

- **Outros:**
   - Tags automáticas para rastreio de recursos.
   - Modularização para fácil manutenção e reuso.

## Observações

- O domínio padrão pode ser alterado em `locals.tf`.
- O script `setup.sh` automatiza a configuração da EC2.
- Todos os recursos são criados/destruídos via `terraform apply` e `terraform destroy`.

## Estrutura dos Arquivos

- `./aws/`: Arquivos principais do Terraform para AWS.
- `./modules/`: Módulos reutilizáveis.
- `./aws/setup.sh`: Script de inicialização da EC2.
