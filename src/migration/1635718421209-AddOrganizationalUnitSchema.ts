import { DatabaseSchemaEnum } from '../modules/shared/enums'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOrganizationalUnitSchema1635718421209 implements MigrationInterface {
  name = 'AddOrganizationalUnitSchema1635718421209'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE SCHEMA "${DatabaseSchemaEnum.ORGANIZATIONAL_UNIT}"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP SCHEMA "${DatabaseSchemaEnum.ORGANIZATIONAL_UNIT}"`)
  }
}
