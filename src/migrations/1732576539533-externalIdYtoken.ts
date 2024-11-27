import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExternalIdYtoken1732576539533 implements MigrationInterface {
  name = 'ExternalIdYtoken1732576539533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "token"`);
    await queryRunner.query(`ALTER TABLE "Product" ADD "external_id" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Product" DROP COLUMN "external_id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "token" character varying(200)`,
    );
  }
}
