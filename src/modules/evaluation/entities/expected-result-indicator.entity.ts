import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { ExpectedResult } from '@modules/model/entities'
import { Indicator } from '.'
import { EvaluationIndicators } from './evaluation-indicators.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class ExpectedResultIndicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => ExpectedResult)
  @JoinColumn({ name: 'expectedResultId', referencedColumnName: 'id' })
  expectedResult: ExpectedResult

  @OneToMany(() => Indicator, (indicator) => indicator.expectedResultIndicator, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'expectedResultIndicatorId' })
  indicators: Indicator[]

  @ManyToOne(() => EvaluationIndicators)
  @JoinColumn({ name: 'evaluationIndicatorsId', referencedColumnName: 'id' })
  evaluationIndicators: EvaluationIndicators
}
