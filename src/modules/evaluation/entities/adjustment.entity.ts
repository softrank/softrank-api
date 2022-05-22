import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AjustmentTypeEnum } from '../enums'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'

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

  @ManyToOne(() => ExpectedResultIndicator, (expectedResultIndicator) => expectedResultIndicator.id)
  expectedResultIndicator: ExpectedResultIndicator
}
