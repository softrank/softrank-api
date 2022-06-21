import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import {
  CreateEvaluationService,
  GenerateEvaluationIndicatorsService,
  CreateEmptyIndicatorService,
  FindEvaluationIndicatorsService,
  UpdateIndicatorService,
  UploadEvidenceSourceService,
  ListEvaluationsService,
  ListEvaluationProcessesService,
  FindEvaluationService,
  CreateAdjustmentService,
  SetIndicatorStatusService,
  DeleteIndicatorService
} from './services'
import { ModelModule } from '../model/model.module'
import { AuditorModule } from '../auditor/auditor.module'
import { EvaluatorModule } from '../evaluator/evaluator.module'
import { EvaluationController, IndicatorController, AdjustmentController, EvidenceSourceController } from './controllers'
import { OrganizationalUnitModule } from '../organizational-unit/organizational-unit.module'
import { PublicModule } from '../public/public.module'
import { IndicatorFile } from './entities/indicator-files.entity'
import {
  Evaluation,
  EvaluationIndicators,
  EvaluationMember,
  ExpectedResultIndicator,
  Indicator,
  EvaluationProject,
  Adjustment,
  Interview,
  EvaluationPlan,
  EvidenceSource,
  EvidenceSourceFile
} from './entities'
import {
  ListEvaluationAdjustments,
  DeleteAdjustmentService,
  UpdateAdjustmentService,
  FindAdjustmentByIdService
} from '@modules/evaluation/services/adjustment'
import { FileManagerModule } from '@modules/file-manager/file-manager.module'
import { IndicatorRepository, EvidenceSourceRepository } from '@modules/evaluation/repositories'
import {
  UploadInterviewService,
  UploadEvaluationPlanService,
  EvaluationNextStepService,
  DeleteEvaluationPlanService,
  DeleteInterviewService
} from './services/evaluation'
import { FindIndicatorByIdService } from './services/indicator'
import { DeleteEvidenceSourceService, SetEvidenceSourceStatusService } from '@modules/evaluation/services/evidence'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluation,
      EvaluationIndicators,
      EvaluationMember,
      ExpectedResultIndicator,
      Indicator,
      IndicatorFile,
      EvaluationProject,
      Adjustment,
      IndicatorRepository,
      Interview,
      EvidenceSourceRepository,
      EvaluationPlan,
      EvidenceSource,
      EvidenceSourceFile
    ]),
    PublicModule,
    forwardRef(() => ModelModule),
    forwardRef(() => AuditorModule),
    forwardRef(() => EvaluatorModule),
    forwardRef(() => OrganizationalUnitModule),
    FileManagerModule
  ],
  controllers: [EvaluationController, IndicatorController, AdjustmentController, EvidenceSourceController],
  providers: [
    CreateEvaluationService,
    GenerateEvaluationIndicatorsService,
    FindEvaluationIndicatorsService,
    CreateEmptyIndicatorService,
    UpdateIndicatorService,
    UploadEvidenceSourceService,
    ListEvaluationsService,
    ListEvaluationProcessesService,
    FindEvaluationService,
    CreateAdjustmentService,
    SetIndicatorStatusService,
    DeleteIndicatorService,
    ListEvaluationAdjustments,
    UploadInterviewService,
    UploadEvaluationPlanService,
    EvaluationNextStepService,
    FindIndicatorByIdService,
    DeleteEvidenceSourceService,
    SetEvidenceSourceStatusService,
    DeleteEvaluationPlanService,
    DeleteInterviewService,
    DeleteAdjustmentService,
    UpdateAdjustmentService,
    FindAdjustmentByIdService
  ],
  exports: [TypeOrmModule, ListEvaluationsService]
})
export class EvaluationModule {}
