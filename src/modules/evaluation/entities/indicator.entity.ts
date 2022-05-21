import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { IndicatorProject } from './indicator-project.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { IndicatorFile } from './indicator-files.entity'
import { IndicatorStatusEnum } from '../enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Indicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar', { nullable: true })
  content: string

  @Column('varchar', { nullable: true })
  status: IndicatorStatusEnum

  @OneToMany(() => IndicatorFile, (indicatorFile) => indicatorFile.indicator)
  @JoinColumn({ name: 'id', referencedColumnName: 'indicatorId' })
  files: IndicatorFile[]

  @ManyToOne(() => ExpectedResultIndicator)
  @JoinColumn({ name: 'expectedResultIndicatorId', referencedColumnName: 'id' })
  expectedResultIndicator: ExpectedResultIndicator

  @OneToMany(() => IndicatorProject, (indicatorProject) => indicatorProject.indicator, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'indicatorId' })
  projects: IndicatorProject[]
}
