import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn
} from 'typeorm'
import { ModelLevels } from '@modules/model/enums'
import { ModelProcess } from '@modules/model/entities'

@Entity({
  schema: 'model'
})
export class ExpectedResult {
  @PrimaryColumn({ type: 'uuid' })
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

  @Column({
    type: 'char',
    default: ModelLevels.G,
    enum: ModelLevels
  })
  minLevel: ModelLevels

  @Column({
    type: 'char',
    default: ModelLevels.A,
    enum: ModelLevels
  })
  maxLevel: ModelLevels

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date

  @ManyToOne(
    () => ModelProcess,
    (modelProcess: ModelProcess) => modelProcess.id
  )
  @JoinColumn({ name: 'process', referencedColumnName: 'id' })
  modelProcess: ModelProcess
}
