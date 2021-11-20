import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { Indicator } from './indicator.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class IndicatorFile extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  source: string

  @ManyToOne(() => Indicator)
  @JoinColumn({ name: 'indicatorId', referencedColumnName: 'id' })
  indicator: Indicator
}
