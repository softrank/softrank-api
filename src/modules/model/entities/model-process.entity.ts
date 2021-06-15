import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { ExpectedResult } from '@modules/model/entities'
import { ModelLevel } from './model-level.entity'
import { ManyToOne } from 'typeorm'

@Entity({
  schema: 'model'
})
export class ModelProcess {
  @PrimaryColumn({
    type: 'uuid'
  })
  id: string

  @Column({
    type: 'varchar'
  })
  name: string

  @Column({
    type: 'varchar'
  })
  initials: string

  @Column({
    type: 'varchar',
    nullable: true
  })
  description: string

  @ManyToOne(() => ModelLevel, (modelLevel: ModelLevel) => modelLevel.id)
  @JoinColumn({ name: 'modelLevel', referencedColumnName: 'id' })
  modelLevel: ModelLevel

  @OneToMany(
    () => ExpectedResult,
    (expectedResult: ExpectedResult) => expectedResult.modelProcess,
    {
      cascade: true
    }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'modelProcess' })
  expectedResult: ExpectedResult[]
}
