import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { ExpectedResult } from '@modules/model/entities'
import { AjustmentTypeEnum } from '../enums'
import { Evaluation } from '.'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Adjustment extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  type: AjustmentTypeEnum

  @Column('varchar')
  problem: string

  @Column('varchar')
  suggestion: string

  @ManyToOne(() => ExpectedResult, (expectedResult) => expectedResult.id)
  expectedResult: ExpectedResult

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id)
  evaluation: Evaluation
}
