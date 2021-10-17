import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { Model } from './model.entity'
import { CommonEntity } from '../../public/entities/entity.entity'

@Entity({ schema: 'model' })
export class ModelManager extends AuditableEntity {
  @PrimaryColumn('uuid')
  id: string

  @OneToMany(() => Model, (model) => model.modelManager)
  @JoinColumn({ name: 'id', referencedColumnName: 'modelManagerId' })
  models: Model[]

  @OneToOne(() => CommonEntity, (commonEntity) => commonEntity.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity
}
