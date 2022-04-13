import { PrimaryColumn, OneToOne, JoinColumn, Column, Entity, OneToMany } from 'typeorm'
import { OrganizationalUnitProject } from './organizational-unit-project.entity'
import { EntityStatusEnum } from '@modules/shared/enums'
import { CommonEntity } from '@modules/public/entities'

@Entity({ schema: 'organizational_unit' })
export class OrganizationalUnit {
  @PrimaryColumn('uuid')
  id: string

  @Column('varchar')
  status: EntityStatusEnum

  @OneToMany(
    () => OrganizationalUnitProject,
    (organizationalUnitProject) => organizationalUnitProject.organizationalUnit,
    { cascade: true }
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'organizationalUnitId' })
  projects: OrganizationalUnitProject[]

  @OneToOne(() => CommonEntity, (commonEntity) => commonEntity.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity
}
