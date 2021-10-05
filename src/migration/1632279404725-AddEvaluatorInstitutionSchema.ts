import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEvaluatorInstitutionSchema1632279404725 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE SCHEMA "evaluatorInstitution"')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP SCHEMA "evaluatorInstitution"')
  }
}
