import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { ExpectedResult } from '@modules/model/entities'
import { Indicator } from '.'
import { TargetAvaliation } from './target-avaliations.entity'
import { EvaluationIndicators } from './evaluation-indicators.entity'
import { Evaluation } from './evaluation.entity'
import { ExpectedResultIndicatorStatusEnum } from '../enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class ExpectedResultIndicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { nullable: true })
  status: ExpectedResultIndicatorStatusEnum

  @ManyToOne(() => ExpectedResult)
  @JoinColumn({ name: 'expectedResultId', referencedColumnName: 'id' })
  expectedResult: ExpectedResult

  @OneToMany(() => Indicator, (indicator) => indicator.expectedResultIndicator, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'expectedResultIndicatorId' })
  indicators: Indicator[]

  @ManyToOne(() => EvaluationIndicators)
  @JoinColumn({ name: 'evaluationIndicatorsId', referencedColumnName: 'id' })
  evaluationIndicators: EvaluationIndicators

  @ManyToOne(() => Evaluation, { cascade: false })
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation

  @OneToMany(() => TargetAvaliation, (targetStatus) => targetStatus.expectedResultIndicator, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'ownerId' })
  targetAvaliations: TargetAvaliation[]
}
