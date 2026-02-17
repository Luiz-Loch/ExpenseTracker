import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableCategoriesToAddColorColumn1771339697507 implements MigrationInterface {
    name = 'AlterTableCategoriesToAddColorColumn1771339697507'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "color" character varying(7)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "color"`);
    }

}
