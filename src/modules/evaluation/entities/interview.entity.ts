import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { Evaluation } from './evaluation.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Interview extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  source: string

  @Column('varchar')
  mimetype: string

  @ManyToOne(() => Evaluation, (evaluation) => evaluation.id, { cascade: false })
  evaluation: Evaluation
}
