import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { AuditableEntity } from '@modules/shared/entities'
import { ModelCapacity } from '@modules/model/entities'
import { TargetAvaliation } from './target-avaliations.entity'
import { Evaluation } from './evaluation.entity'
import { Indicator } from './indicator.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class ModelCapacityIndicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany(() => Indicator, (indicator) => indicator.modelCapacityIndicator)
  @JoinColumn({ name: 'id', referencedColumnName: 'modelCapacityIndicatorId' })
  indicators: Indicator[]

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id)
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation

  @ManyToOne(() => ModelCapacity, (modelCapacity) => modelCapacity.id)
  @JoinColumn({ name: 'modelCapacityId', referencedColumnName: 'id' })
  modelCapacity: ModelCapacity

  @OneToMany(() => TargetAvaliation, (targetStatus) => targetStatus.ownerId, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'ownerId' })
  targetAvaluations: TargetAvaliation[]
}
