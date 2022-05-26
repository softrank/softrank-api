import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { EvaluationStateEnum, EvidenceSourceStatusEnum } from '../enums'
import { EvidenceSourceFile } from './evidence-source-file.entity'
import { EvaluationProject } from './evaluation-project.entity'
import { AuditableEntity } from '@modules/shared/entities'
import { DatabaseSchemaEnum } from '@modules/shared/enums'
import { Indicator } from './indicator.entity'

@Entity({ schema: DatabaseSchemaEnum.EVALUATION })
export class EvidenceSource extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  createdOn: EvaluationStateEnum

  @Column('varchar', { nullable: true })
  status: EvidenceSourceStatusEnum

  @ManyToOne(() => Indicator, (indicator) => indicator.id)
  @JoinColumn({ name: 'indicatorId', referencedColumnName: 'id' })
  indicator: Indicator

  @ManyToOne(() => EvaluationProject, (evaluationProject) => evaluationProject.id, { cascade: false })
  @JoinColumn({ name: 'evaluationProjectId', referencedColumnName: 'id' })
  evaluationProject: EvaluationProject

  @OneToMany(() => EvidenceSourceFile, (evidenceSourceFiles) => evidenceSourceFiles.evidenceSource, { cascade: true })
  @JoinColumn({ name: 'id', referencedColumnName: 'evidenceSourceId' })
  files: EvidenceSourceFile[]
}
