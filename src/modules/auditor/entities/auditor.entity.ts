import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { CommonEntity } from '../../public/entities/entity.entity'
import { EntityStatusEnum } from '../../shared/enums/entity-status.enum'

@Entity({ schema: 'auditor' })
export class Auditor extends AuditableEntity {
  @PrimaryColumn('uuid')
  id: string

  @Column('varchar', { default: EntityStatusEnum.PENDING })
  status: EntityStatusEnum

  @OneToOne(() => CommonEntity, (commonEntity) => commonEntity.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity
}
