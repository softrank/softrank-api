import { ModelProcess } from '@modules/model/entities'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { TargetAvaliationTypeEnum, TargetAvaliationStatusEnum, TargetAvaliationOwnerType } from '../enums'
import { EvaluationProject } from './evaluation-project.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class TargetAvaliation<Status = TargetAvaliationStatusEnum> extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  status: Status

  @Column('uuid', { nullable: true })
  targetId: string

  @Column('varchar', { nullable: true })
  targetType: TargetAvaliationTypeEnum

  @Column('varchar')
  ownerId: string

  @Column('varchar')
  ownerType: TargetAvaliationOwnerType

  @ManyToOne(() => ModelProcess, (modelProcess) => modelProcess.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'targetId', referencedColumnName: 'id' })
  modelProcess: ModelProcess

  @ManyToOne(() => EvaluationProject, (evaluationProject) => evaluationProject.id, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'targetId', referencedColumnName: 'id' })
  evaluationProject: EvaluationProject
}
