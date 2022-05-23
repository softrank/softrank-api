import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { EvaluationMemberStatusEnum } from '../enums'
import { EvaluationMemberType } from '../enums/evaluation-member-type.enum'
import { Evaluation } from './evaluation.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvaluationMember extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  type: EvaluationMemberType

  @Column('varchar')
  status: EvaluationMemberStatusEnum

  @Column('uuid', { nullable: true })
  memberId: string

  @ManyToOne(() => Evaluation)
  @JoinColumn({ name: 'evaluationId', referencedColumnName: 'id' })
  evaluation: Evaluation
}
