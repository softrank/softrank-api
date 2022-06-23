import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { ModelCapacityTypeEnum } from '../enum'
import { ModelLevel } from './model-level.entity'
import { Model } from './model.entity'

@Entity({ schema: DatabaseSchemaEnum.MODEL })
export class ModelCapacity extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  type: ModelCapacityTypeEnum

  @Column('varchar')
  name: string

  @ManyToOne(() => ModelLevel, (modelLevel) => modelLevel.id)
  @JoinColumn({ name: 'minModelLevelId', referencedColumnName: 'id' })
  minModelLevel: ModelLevel

  @ManyToOne(() => ModelLevel, (modelLevel) => modelLevel.id)
  @JoinColumn({ name: 'maxModelLevelId', referencedColumnName: 'id' })
  maxModelLevel: ModelLevel

  @ManyToOne(() => Model, (model) => model.id)
  @JoinColumn({ name: 'modelId', referencedColumnName: 'id' })
  model: Model
}
