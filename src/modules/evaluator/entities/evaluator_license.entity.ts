import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { EvaluatorLicenseType } from '@modules/evaluator/enums'
import { Evaluator } from '@modules/evaluator/entities'
import { ModelLevel } from '@modules/model/entities'

@Entity({ schema: 'evaluator' })
export class EvaluatorLicense {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('date')
  expiration: Date

  @Column('bool')
  isActive: boolean

  @Column('varchar', { default: EvaluatorLicenseType.ADJUNCT })
  type: EvaluatorLicenseType

  @ManyToOne(() => ModelLevel)
  @JoinColumn({ name: 'modelLevelId', referencedColumnName: 'id' })
  modelLevel: ModelLevel

  @ManyToOne(() => Evaluator)
  @JoinColumn({ name: 'evaluatorId', referencedColumnName: 'id' })
  evaluator: Evaluator
}
