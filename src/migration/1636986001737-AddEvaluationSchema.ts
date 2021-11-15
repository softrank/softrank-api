import { MigrationInterface, QueryRunner } from 'typeorm'
import { DatabaseSchemaEnum } from '../modules/shared/enums'

export class AddEvaluationSchema1636986001737 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA "${DatabaseSchemaEnum.EVALUATION}"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA "${DatabaseSchemaEnum.EVALUATION}"`)
  }
}
