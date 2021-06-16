import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { ModelLevels } from '@modules/model/enums'
import { Model } from './model.entity'
import { ModelProcess } from './model-process.entity'

@Entity({
  schema: 'model'
})
export class ModelLevel {
  @PrimaryColumn({
    type: 'uuid'
  })
  id: string

  @Column({
    type: 'char',
    enum: ModelLevels
  })
  initial: ModelLevels

  @ManyToOne(() => Model, (model: Model) => model.modelLevel)
  @JoinColumn({ name: 'model', referencedColumnName: 'id' })
  model: Model

  @OneToMany(
    () => ModelProcess,
    (modelProcess: ModelProcess) => modelProcess.modelLevel
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'modelLevel' })
  modelProcess: ModelProcess[]
}
