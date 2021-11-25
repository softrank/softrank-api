import { ModelLevel } from '@modules/model/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, OneToMany, JoinColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { EvaluationMember } from './evaluation.member.entity'
import { OrganizationalUnit } from '../../organizational-unit/entities/organzational-unit.entity'
import { EvaluationStatusEnum } from '../enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Evaluation extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  status: EvaluationStatusEnum

  @Column('varchar')
  name: string

  @Column('date')
  start: Date

  @Column('date')
  end: Date

  @Column('varchar')
  implementationInstitution: string

  @ManyToOne(() => ModelLevel)
  @JoinColumn({ name: 'expectedModelLevelId', referencedColumnName: 'id' })
  expectedModelLevel: ModelLevel

  @OneToMany(() => EvaluationMember, (evaluationMember) => evaluationMember.evaluation, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  evaluationMembers: EvaluationMember[]

  @ManyToOne(() => OrganizationalUnit)
  @JoinColumn({ name: 'organizationalUnitId', referencedColumnName: 'id' })
  organizationalUnit: OrganizationalUnit
}
