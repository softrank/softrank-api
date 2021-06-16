import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { ModelProcess } from '@modules/model/entities'
import { ModelLevel } from './model-level.entity'

@Entity({
  schema: 'model'
})
export class Model {
  @PrimaryColumn({
    type: 'uuid'
  })
  id: string

  @Column({
    type: 'varchar'
  })
  name: string

  @Column({
    type: 'timestamp'
  })
  year: Date

  @Column({
    type: 'varchar',
    nullable: true
  })
  description: string

  // @OneToMany(
  //   () => ModelProcess,
  //   (modelProcess: ModelProcess) => modelProcess.id
  // )
  // @JoinColumn({ name: 'modelProcess', referencedColumnName: 'id' })
  // modelProcess: ModelProcess

  @OneToMany(() => ModelLevel, (modelLevel: ModelLevel) => modelLevel.model)
  @JoinColumn({ name: 'id', referencedColumnName: 'model' })
  modelLevel: ModelLevel
}
