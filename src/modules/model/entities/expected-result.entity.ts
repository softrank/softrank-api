import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { ModelProcess } from '@modules/model/entities'

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

  @Column({ type: 'char' })
  minLevel: string

  @Column({ type: 'char', nullable: true })
  maxLevel: string

  @ManyToOne(() => ModelProcess, (modelProcess: ModelProcess) => modelProcess.id)
  @JoinColumn({ name: 'modelProcessId', referencedColumnName: 'id' })
  modelProcess: ModelProcess
}
