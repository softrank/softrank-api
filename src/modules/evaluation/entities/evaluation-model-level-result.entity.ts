import { ModelLevel } from '@modules/model/entities'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Evaluation } from './evaluation.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvaluationModelLevelResult extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  result: string

  @ManyToOne(() => ModelLevel, (modelLevel) => modelLevel.id, { cascade: false })
  @JoinColumn({ name: 'modelLevelId', referencedColumnName: 'id' })
  modelLevel: ModelLevel

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id)
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation
}
