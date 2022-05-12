import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { Evaluation } from '@modules/evaluation/entities'
import { Model } from '@modules/model/entities'

@Entity({ schema: 'model' })
@Unique(['initial', 'name', 'model'])
export class ModelLevel extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'char' })
  initial: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar', nullable: true })
  predecessor: string

  @ManyToOne(() => Model, (model: Model) => model.id)
  @JoinColumn({ name: 'modelId', referencedColumnName: 'id' })
  model: Model

  @OneToMany(() => Evaluation, (evaluation) => evaluation.expectedModelLevel)
  evaluations: Evaluation[]
}
