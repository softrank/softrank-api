import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne, Column } from 'typeorm'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { CommonEntity } from '@modules/public/entities'
import { EntityStatusEnum } from '@modules/shared/enums'

@Entity({ schema: 'evaluator' })
export class Evaluator {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { default: EntityStatusEnum.PENDING })
  status: EntityStatusEnum

  @OneToMany(() => EvaluatorLicense, (license) => license.evaluator, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluatorId' })
  licenses: EvaluatorLicense[]

  @OneToOne(() => CommonEntity)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity

  @ManyToOne(() => EvaluatorInstitution, (evaluatorInstitution) => evaluatorInstitution.id)
  @JoinColumn({ name: 'evaluatorInstitutionId', referencedColumnName: 'id' })
  evaluatorInstitution: EvaluatorInstitution
}
