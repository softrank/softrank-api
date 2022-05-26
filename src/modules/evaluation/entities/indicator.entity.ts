import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { EvidenceSource } from './evidence-source.entity'
import { IndicatorFile } from './indicator-files.entity'
import { IndicatorStatusEnum } from '../enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Indicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { nullable: true })
  name: string

  @Column('varchar', { nullable: true })
  qualityAssuranceGroup: string

  @Column('varchar', { nullable: true })
  status: IndicatorStatusEnum

  @OneToMany(() => IndicatorFile, (indicatorFile) => indicatorFile.indicator, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'indicatorId' })
  files: IndicatorFile[]

  @ManyToOne(() => ExpectedResultIndicator, { cascade: false })
  @JoinColumn({ name: 'expectedResultIndicatorId', referencedColumnName: 'id' })
  expectedResultIndicator: ExpectedResultIndicator

  @OneToMany(() => EvidenceSource, (evidenceSources) => evidenceSources.indicator, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'indicatorId' })
  evidenceSources: EvidenceSource[]
}
