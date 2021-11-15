import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ExpectedResultIndicator } from '.'
import { Evaluation } from './evaluation.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvaluationIndicators extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany(
    () => ExpectedResultIndicator,
    (expectedResultIndicator) => expectedResultIndicator.evaluationIndicators,
    { cascade: true }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationIndicatorsId' })
  expectedResultIndicators: ExpectedResultIndicator[]

  @ManyToOne(() => Evaluation)
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation
}
