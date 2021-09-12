import { Entity, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm'
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
  @JoinColumn({ name: 'CommonEntityId', referencedColumnName: 'id' })
  commonEntity: CommonEntity
}
