import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { ExpectedResultIndicator } from './expected-result-indicator.entity'
import { AuditableEntity } from '../../shared/entities/auditable.entity'
import { IndicatorTypeEnum } from '../enums/indicator-type.enum'
import { IndicatorProject } from './indicator-project.entity'
import { DatabaseSchemaEnum } from '@modules/shared/enums'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class Indicator extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  type: IndicatorTypeEnum

  @Column('varchar', { nullable: true })
  content: string

  @Column('varchar', { nullable: true })
  source: string

  @ManyToOne(() => ExpectedResultIndicator)
  @JoinColumn({ name: 'expectedResultIndicatorId', referencedColumnName: 'id' })
  expectedResultIndicator: ExpectedResultIndicator

  @OneToMany(() => IndicatorProject, (indicatorProject) => indicatorProject.indicator, { cascade: true })
  projects: IndicatorProject[]
}
