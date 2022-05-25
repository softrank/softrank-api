import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Evaluation } from './evaluation.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvaluationPlan extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  source: string

  @Column('varchar')
  mimetype: string

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id, { cascade: false })
  evaluation: Evaluation
}
