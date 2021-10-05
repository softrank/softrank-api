import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { EvaluatorInstitution } from './evaluator-institution.entity'

@Entity({ schema: 'evaluatorInstitution' })
export class EvaluatorInstitutionAddress extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  zipcode: string

  @Column('varchar')
  addressLine: string

  @Column('varchar')
  number: string

  @Column('varchar', { nullable: true })
  observation: string

  @Column('varchar')
  city: string

  @Column('varchar')
  state: string

  @ManyToOne(() => EvaluatorInstitution, (evaluatorInstitution) => evaluatorInstitution.id)
  @JoinColumn({ name: 'evaluatorInstitutionId', referencedColumnName: 'id' })
  evaluatorInstitution: EvaluatorInstitution
}
