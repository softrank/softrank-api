import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne } from 'typeorm'
import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { EvaluatorLicense } from '@modules/evaluator/entities'
import { CommonEntity } from '@modules/public/entities'

@Entity({ schema: 'evaluator' })
export class Evaluator {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @OneToMany(() => EvaluatorLicense, (license) => license.evaluator, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluatorId' })
  licenses: EvaluatorLicense[]

  @OneToOne(() => CommonEntity)
  @JoinColumn({ name: 'commonEntityId', referencedColumnName: 'id' })
  commonEntity: CommonEntity

  @ManyToOne(() => EvaluatorInstitution, (evaluatorInstitution) => evaluatorInstitution.id)
  @JoinColumn({ name: 'evaluatorInstitutionId', referencedColumnName: 'id' })
  evaluatorInstitution: EvaluatorInstitution
}
