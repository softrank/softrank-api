import { OrganizationalUnitProject } from '@modules/organizational-unit/entities'
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Indicator } from './indicator.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class IndicatorProject extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(() => Indicator)
  @JoinColumn({ name: 'indicatorId', referencedColumnName: 'id' })
  indicator: Indicator

  @ManyToOne(() => OrganizationalUnitProject)
  @JoinColumn({ name: 'projectId', referencedColumnName: 'id' })
  project: OrganizationalUnitProject
}
