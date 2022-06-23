import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { EvidenceSource } from './evidence-source.entity'
import { IndicatorFile } from './indicator-files.entity'
import { IndicatorStatusEnum } from '../enums'
import { ModelCapacityIndicator } from './model-capacity-indicator.entity'

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

  @ManyToOne(() => ModelCapacityIndicator, (modelCapacityIndicator) => modelCapacityIndicator.id, { cascade: false })
  @JoinColumn({ name: 'modelCapacityIndicatorId', referencedColumnName: 'id' })
  modelCapacityIndicator: ModelCapacityIndicator

  @OneToMany(() => EvidenceSource, (evidenceSources) => evidenceSources.indicator, { cascade: false })
  @JoinColumn({ name: 'id', referencedColumnName: 'indicatorId' })
  evidenceSources: EvidenceSource[]
}
