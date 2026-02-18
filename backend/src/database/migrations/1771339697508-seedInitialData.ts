import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedInitialData1771339697508 implements MigrationInterface {
    name = 'SeedInitialData1771339697508'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

        await queryRunner.query(`
            -- Para gen_random_uuid()
            CREATE EXTENSION IF NOT EXISTS pgcrypto;

            -- 1) ROOT USER + 15 CATEGORIES + 12*20 EXPENSES
            WITH root_user AS (
            INSERT INTO users (
                name, email, password_hash
            )
            VALUES (
                'Root',
                'root@local.test',
                '$2a$10$bUp6b4rYonbrI3R7I8RIzOxnuRaqLvRQ/YRt7eM4LxkvGEEXlyIWu' -- asdASD123!@#
            )
            RETURNING id
            ),

            ins_categories AS (
            INSERT INTO categories (
                user_id, name, color
            )
            SELECT
                ru.id,
                c.name,
                c.color
            FROM root_user ru
            CROSS JOIN (
                VALUES
                ('Moradia',           '#4F46E5'),
                ('Supermercado',      '#10B981'),
                ('Restaurantes',      '#F59E0B'),
                ('Transporte',        '#06B6D4'),
                ('Saúde',             '#EF4444'),
                ('Educação',          '#8B5CF6'),
                ('Lazer',             '#EC4899'),
                ('Assinaturas',       '#64748B'),
                ('Compras',           '#F97316'),
                ('Contas',            '#0EA5E9'),
                ('Viagem',            '#22C55E'),
                ('Pets',              '#A855F7'),
                ('Presentes',         '#FB7185'),
                ('Investimentos',     '#14B8A6'),
                ('Outros',            null)
            ) AS c(name, color)
            RETURNING id, user_id, name
            ),

            -- meses: do começo do mês de 11 meses atrás até o começo do mês atual (12 meses)
            months AS (
            SELECT generate_series(
                date_trunc('month', NOW()) - interval '11 months',
                date_trunc('month', NOW()),
                interval '1 month'
            ) AS month_start
            ),


            -- =============================
            -- 20 EXPENSES POR MÊS
            -- =============================

            expense_rows AS (
            SELECT
                m.month_start,
                gs.i AS n_in_month,
                row_number() OVER (PARTITION BY m.month_start ORDER BY gs.i) AS rn
            FROM months m
            CROSS JOIN LATERAL generate_series(1, 20) AS gs(i)
            ),

            -- indexar categorias 1..15 (pra fazer um "round-robin" estável)
            cat_pick AS (
            SELECT
                ic.id,
                ic.user_id,
                row_number() OVER (PARTITION BY ic.user_id ORDER BY ic.name) AS rn
            FROM ins_categories ic
            )


            -- =============================
            -- EXPENSE INSERT
            -- =============================

            INSERT INTO expenses (
            user_id, category_id,
            name, description,
            amount_cents, currency, type,
            spent_at
            )
            SELECT
            ru.id,

            -- 15 com categoria, 5 sem (NULL)
            CASE
                WHEN er.rn <= 15 THEN (
                SELECT cp.id
                FROM cat_pick cp
                WHERE cp.user_id = ru.id
                    AND cp.rn = ((er.n_in_month - 1) % 15) + 1
                )
                ELSE NULL
            END AS category_id,

            -- nomes variados
            (
                (ARRAY[
                'Mercado', 'Almoço', 'Jantar', 'Uber/99', 'Farmácia',
                'Conta de Luz', 'Conta de Internet', 'Streaming', 'Academia',
                'Delivery', 'Combustível', 'Livro/Curso', 'Café', 'Manutenção'
                ])[1 + floor(random() * 14)::int]
                || ' - ' || to_char(er.month_start, 'Mon YYYY')
            ) AS name,

            -- metade com descrição, metade NULL
            CASE
                WHEN random() < 0.5 THEN NULL
                ELSE 'Seed data gerada para testes'
            END AS description,

            -- 5,00 a 950,00 em centavos (aprox)
            (500 + floor(random() * 94500))::int AS amount_cents,

            'BRL'::expenses_currency_enum AS currency,

            'EXPENSE'::expenses_type_enum AS type,

            -- data aleatória dentro do mês (dia 1..28) + hora/min aleatórios
            er.month_start
                + (floor(random() * 28)::int || ' days')::interval
                + (floor(random() * 24)::int || ' hours')::interval
                + (floor(random() * 60)::int || ' minutes')::interval
            AS spent_at
            FROM expense_rows er
            CROSS JOIN root_user ru

            UNION ALL

            -- =============================
            -- 12 INCOMES POR MÊS
            -- =============================

            SELECT
            ru.id,
            NULL, -- normalmente receita não tem categoria

            (
                (ARRAY[
                'Salário',
                'Freelance',
                'Bônus',
                'Dividendos',
                'Cashback',
                'Reembolso'
                ])[1 + floor(random() * 6)::int]
                || ' - ' || to_char(m.month_start, 'Mon YYYY')
            ),

            'Receita mensal',

            -- valores maiores que despesas
            (300000 + floor(random() * 500000))::int, -- R$ 3.000 a R$ 8.000

            'BRL'::expenses_currency_enum AS currency,
            'INCOME'::expenses_type_enum AS type,

            m.month_start
                + (floor(random() * 5)::int || ' days')::interval
                + interval '9 hours'

            FROM months m
            CROSS JOIN root_user ru
            CROSS JOIN LATERAL generate_series(1, 4);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM expenses WHERE user_id = (SELECT id FROM users WHERE email = 'root@local.test')`);
        await queryRunner.query(`DELETE FROM categories WHERE user_id = (SELECT id FROM users WHERE email = 'root@local.test')`);
        await queryRunner.query(`DELETE FROM users WHERE email = 'root@local.test'`);
    }

}
