import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { CommonEntity } from '../../public/entities/entity.entity'

@Entity({ schema: 'auditor' })
export class Auditor extends AuditableEntity {
  @PrimaryColumn('uuid')
  id: string

  @OneToOne(() => CommonEntity, (commonEntity) => commonEntity.id)
  @JoinColumn({ name: 'id', referencedColumnName: 'id' })
  commonEntity: CommonEntity
}
