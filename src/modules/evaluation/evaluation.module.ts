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
import {
  EvaluationController,
  IndicatorController,
  AdjustmentController,
  EvidenceSourceController,
  EvaluationIndicatorController
} from './controllers'
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
  EvidenceSourceFile,
  ModelCapacityIndicator
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
  DeleteInterviewService,
  EvaluationHasAModelCapacityTypeService,
  ListModelProcessToOrganizationalModelCapacitiesIndicator
} from './services/evaluation'
import { FindIndicatorByIdService } from './services/indicator'
import { DeleteEvidenceSourceService, SetEvidenceSourceStatusService } from '@modules/evaluation/services/evidence'
import {
  GenerateEvaluationModelCapacityIndicatorsService,
  ListEvaluationModelCapacityIndicatorsService
} from './services/model-capacity-indicators'
import {
  SetExpectedResultIndicatorProjecAvaliationService,
  SetExpectedResultIndicatorStatusService
} from './services/expected-result-indicator'
import { TargetAvaliation } from './entities/target-avaliations.entity'
import {
  SetModelCapacityIndicatorStatusService,
  SetModelCapacityIndicatorTargetAvaliationService
} from './services/model-capacity-indicator'

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
      EvidenceSourceFile,
      ModelCapacityIndicator,
      TargetAvaliation
    ]),
    PublicModule,
    forwardRef(() => ModelModule),
    forwardRef(() => AuditorModule),
    forwardRef(() => EvaluatorModule),
    forwardRef(() => OrganizationalUnitModule),
    FileManagerModule
  ],
  controllers: [EvaluationController, IndicatorController, AdjustmentController, EvidenceSourceController, EvaluationIndicatorController],
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
    FindAdjustmentByIdService,
    GenerateEvaluationModelCapacityIndicatorsService,
    ListEvaluationModelCapacityIndicatorsService,
    EvaluationHasAModelCapacityTypeService,
    ListModelProcessToOrganizationalModelCapacitiesIndicator,
    SetExpectedResultIndicatorStatusService,
    SetExpectedResultIndicatorProjecAvaliationService,
    SetModelCapacityIndicatorStatusService,
    SetModelCapacityIndicatorTargetAvaliationService
  ],
  exports: [TypeOrmModule, ListEvaluationsService]
})
export class EvaluationModule {}
