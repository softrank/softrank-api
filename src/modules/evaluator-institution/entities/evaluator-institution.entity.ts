import { JoinColumn, OneToOne, PrimaryColumn, Entity, OneToMany, Column } from 'typeorm'
import { EvaluatorInstitutionAddress } from '@modules/evaluator-institution/entities'
import { AuditableEntity } from '@modules/shared/entities'
import { CommonEntity } from '@modules/public/entities'
import { Evaluator } from '@modules/evaluator/entities'
import { EntityStatusEnum } from '@modules/shared/enums'

@Entity({ schema: 'evaluatorInstitution' })
export class EvaluatorInstitution extends AuditableEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column('varchar', { default: EntityStatusEnum.PENDING })
  status: EntityStatusEnum

  @OneToMany(
    () => EvaluatorInstitutionAddress,
    (evaluatorInstitutionAddress) => evaluatorInstitutionAddress.evaluatorInstitution,
    { cascade: true }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluatorInstitutionId' })
  addresses: EvaluatorInstitutionAddress[]

  @OneToOne(() => CommonEntity, (commonEntity) => commonEntity.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity

  @OneToMany(() => Evaluator, (evaluator) => evaluator.evaluatorInstitution)
  @JoinColumn({ name: 'id', referencedColumnName: 'evaluatorInstitutionId' })
  evaluators: Evaluator[]

  get address() {
    if (this?.addresses?.length) {
      return this.addresses[0]
    }
  }
}
