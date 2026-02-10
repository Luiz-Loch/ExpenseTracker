import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateExpensesTable1770733150925 implements MigrationInterface {
    name = 'CreateExpensesTable1770733150925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."expenses_currency_enum" AS ENUM('BRL')`);
        await queryRunner.query(`CREATE TYPE "public"."expenses_type_enum" AS ENUM('EXPENSE', 'INCOME')`);
        await queryRunner.query(`CREATE TABLE "expenses" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" character varying(255), "amount_cents" integer NOT NULL, "currency" "public"."expenses_currency_enum" NOT NULL DEFAULT 'BRL', "type" "public"."expenses_type_enum" NOT NULL, "spent_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" uuid NOT NULL, "category_id" uuid, CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_49a0ca239d34e74fdc4e0625a78" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "expenses" ADD CONSTRAINT "FK_5d1f4be708e0dfe2afa1a3c376c" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_5d1f4be708e0dfe2afa1a3c376c"`);
        await queryRunner.query(`ALTER TABLE "expenses" DROP CONSTRAINT "FK_49a0ca239d34e74fdc4e0625a78"`);
        await queryRunner.query(`DROP TABLE "expenses"`);
        await queryRunner.query(`DROP TYPE "public"."expenses_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."expenses_currency_enum"`);
    }

}
