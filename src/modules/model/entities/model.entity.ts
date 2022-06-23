import { Column, Entity, JoinColumn, OneToMany, Unique, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { ModelProcess, ModelLevel } from '@modules/model/entities'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { ModelManager } from './model-manager.entity'
import { ModelCapacity } from './model-capacity.entity'

@Entity({ schema: 'model' })
@Unique(['name', 'year'])
export class Model extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'timestamp' })
  year: Date

  @Column({ type: 'varchar', nullable: true })
  description: string

  @OneToMany(() => ModelProcess, (modelProcess: ModelProcess) => modelProcess.model, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'modelId' })
  modelProcesses: ModelProcess[]

  @OneToMany(() => ModelLevel, (modelLevel: ModelLevel) => modelLevel.model, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'modelId' })
  modelLevels: ModelLevel[]

  @OneToMany(() => ModelCapacity, (modelCapacity) => modelCapacity.model)
  @JoinColumn({ name: 'id', referencedColumnName: 'modelId' })
  modelCapacities: ModelCapacity[]

  @ManyToOne(() => ModelManager)
  @JoinColumn({ name: 'modelManagerId', referencedColumnName: 'id' })
  modelManager: ModelManager
}
