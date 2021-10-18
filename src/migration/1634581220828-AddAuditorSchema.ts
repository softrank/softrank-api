import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAuditorSchema1634581220828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA "auditor"')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP SCHEMA "auditor"')
  }
}
