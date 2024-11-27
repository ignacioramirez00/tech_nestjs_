import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApiFudo1732574470975 implements MigrationInterface {
  name = 'CreateApiFudo1732574470975';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" ADD "api_fudo_syncronized" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" DROP COLUMN "api_fudo_syncronized"`,
    );
  }
}
