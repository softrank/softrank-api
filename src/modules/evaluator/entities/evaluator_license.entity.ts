import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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

  @ManyToOne(() => ModelLevel)
  @JoinColumn({ name: 'modelLevelId', referencedColumnName: 'id' })
  modelLevel: ModelLevel

  @ManyToOne(() => Evaluator)
  @JoinColumn({ name: 'evaluatorId', referencedColumnName: 'id' })
  evaluator: Evaluator
}
