import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { OrganizationalUnit } from './organzational-unit.entity'

@Entity({ schema: DatabaseSchemaEnum.ORGANIZATIONAL_UNIT })
export class OrganizationalUnitProject extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @ManyToOne(() => OrganizationalUnit)
  @JoinColumn({ name: 'organizationalUnitId', referencedColumnName: 'id' })
  organizationalUnit: OrganizationalUnit
}
