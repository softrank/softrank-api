import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { ModelProcess } from '@modules/model/entities'
import { ModelLevel } from './model-level.entity'
import { EvaluationIndicatorsExpectedResultDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { EvaluationIndicators, ExpectedResultIndicator } from '@modules/evaluation/entities'

@Entity({ schema: 'model' })
@Unique(['name', 'initial', 'modelProcess'])
export class ExpectedResult extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  initial: string

  @Column({ type: 'varchar' })
  description: string

  @ManyToOne(() => ModelLevel)
  @JoinColumn({ name: 'minLevelId', referencedColumnName: 'id' })
  minLevel: ModelLevel

  @ManyToOne(() => ModelLevel)
  @JoinColumn({ name: 'maxLevelId', referencedColumnName: 'id' })
  maxLevel: ModelLevel

  @ManyToOne(() => ModelProcess, (modelProcess: ModelProcess) => modelProcess.id)
  @JoinColumn({ name: 'modelProcessId', referencedColumnName: 'id' })
  modelProcess: ModelProcess

  @ManyToOne(
    () => ExpectedResultIndicator,
    (expectedResultIndicator) => expectedResultIndicator.expectedResult
  )
  expectedResultIndicator: ExpectedResultIndicator
}
