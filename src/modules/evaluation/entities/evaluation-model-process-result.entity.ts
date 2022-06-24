import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Evaluation } from './evaluation.entity'
import { ModelLevel, ModelProcess } from '@modules/model/entities'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvaluationModelProcessResult extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  result: string

  @ManyToOne(() => ModelLevel, (modelLevel) => modelLevel.id)
  @JoinColumn({ name: 'evaluatedModelLevelId', referencedColumnName: 'id' })
  evaluatedModelLevel: ModelLevel

  @ManyToOne(() => ModelProcess, (modelProcess) => modelProcess.id)
  @JoinColumn({ name: 'modelProcessId', referencedColumnName: 'id' })
  modelProcess: ModelProcess

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id, { cascade: false })
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation
}
