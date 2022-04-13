import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Indicator } from './indicator.entity'
import { EvaluationProject } from '.'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class IndicatorProject extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Indicator)
  @JoinColumn({ name: 'indicatorId', referencedColumnName: 'id' })
  indicator: Indicator

  @ManyToOne(() => EvaluationProject)
  @JoinColumn({ name: 'projectId', referencedColumnName: 'id' })
  project: EvaluationProject
}
