import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm'
import { ModelLevel } from './model-level.entity'
import { CreateModelDto } from '../dto/create-model.dto'
import { v4 } from 'uuid'

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

  static createModel(createModelDto: CreateModelDto): Model {
    const model = new Model()

    model.id = v4()
    model.name = createModelDto.name
    model.year = createModelDto.year
    model.description = createModelDto.description

    return model
  }
}
