import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { ExpectedResult } from '@modules/model/entities'
import { Model } from '@modules/model/entities'
import { ModelProcessTypeEnum } from '../enum'

@Entity({ schema: 'model' })
@Unique(['name', 'initial', 'model'])
export class ModelProcess extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  initial: string

  @Column({ type: 'varchar' })
  description: string

  @Column({ type: 'varchar' })
  type: ModelProcessTypeEnum

  @OneToMany(() => ExpectedResult, (expectedResult: ExpectedResult) => expectedResult.modelProcess, {
    cascade: true
  })
  @JoinColumn({ name: 'id', referencedColumnName: 'modelProcessId' })
  expectedResults: ExpectedResult[]

  @ManyToOne(() => Model)
  @JoinColumn({ name: 'modelId', referencedColumnName: 'id' })
  model: Model
}
