import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateSchemas1630173474511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE IF NOT EXISTS SCHEMA model')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP IF EXISTS SCHEMA model')
  }
}
