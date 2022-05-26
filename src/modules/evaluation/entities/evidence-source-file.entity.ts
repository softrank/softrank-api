import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { EvidenceSource } from './evidence-source.entity'
import { EvidenceSourceFileStatusEnum } from '../enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvidenceSourceFile extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('varchar')
  source: string

  @Column('varchar')
  mimetype: string

  @Column('varchar', { nullable: true })
  status: EvidenceSourceFileStatusEnum

  @ManyToOne(() => EvidenceSource, (evidenceSource) => evidenceSource.id, { cascade: false })
  @JoinColumn({ name: 'evidenceSourceId', referencedColumnName: 'id' })
  evidenceSource: EvidenceSource
}
