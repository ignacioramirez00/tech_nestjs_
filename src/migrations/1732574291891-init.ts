import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1732574291891 implements MigrationInterface {
  name = 'Init1732574291891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Product" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "userCreateProductFkId" uuid, CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30) NOT NULL, "lastname" character varying(30) NOT NULL, "username" character varying(30) NOT NULL, "email" character varying(30) NOT NULL, "password" character varying(200) NOT NULL, "token" character varying(200), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "Product" ADD CONSTRAINT "FK_334f15131af4c80be30e885bfb9" FOREIGN KEY ("userCreateProductFkId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Product" DROP CONSTRAINT "FK_334f15131af4c80be30e885bfb9"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "Product"`);
  }
}
