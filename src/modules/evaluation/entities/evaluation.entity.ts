import { Column, PrimaryGeneratedColumn, ManyToOne, Entity, OneToMany, JoinColumn } from 'typeorm'
import { OrganizationalUnit } from '../../organizational-unit/entities/organzational-unit.entity'
import { EvaluationModelProcessResult } from './evaluation-model-process-result.entity'
import { EvaluationModelLevelResult } from './evaluation-model-level-result.entity'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { EvaluationMember } from './evaluation-member.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { ModelLevel } from '@modules/model/entities'
import { EvaluationStateEnum } from '../enums'
import { EvaluationPlan, EvaluationProject } from '.'
import { Interview } from './interview.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Evaluation extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  state: EvaluationStateEnum

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

  @OneToMany(() => EvaluationProject, (evaluationProject) => evaluationProject.evaluation, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  projects: EvaluationProject[]

  @OneToMany(() => ExpectedResultIndicator, (expectedResultIndicator) => expectedResultIndicator.evaluation)
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  expectedResultIndicator: ExpectedResultIndicator[]

  @OneToMany(() => Interview, (interview) => interview.evaluation, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  interviews: Interview[]

  @OneToMany(() => EvaluationPlan, (evaluationPlan) => evaluationPlan.evaluation, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  plans: EvaluationPlan[]

  @OneToMany(() => EvaluationModelProcessResult, (evaluationModelProcessResult) => evaluationModelProcessResult.evaluation, {
    cascade: false
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  evaluationModelProcessResults: EvaluationModelProcessResult[]

  @OneToMany(() => EvaluationModelLevelResult, (evaluationModelLevelResult) => evaluationModelLevelResult.evaluation, {
    cascade: false
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluationId' })
  evaluationModelLevelResults: EvaluationModelLevelResult[]

  get plan(): EvaluationPlan {
    if (this.plans?.length) {
      const mainPlan = this.plans.find((plan) => !plan.deletedAt)
      return mainPlan
    }
  }
}
