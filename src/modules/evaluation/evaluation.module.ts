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
import { EvaluationController, IndicatorController, AdjustmentController } from './controllers'
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
  Interview
} from './entities'
import { ListEvaluationAdjustments } from '@modules/evaluation/services/adjustment'
import { FileManagerModule } from '@modules/file-manager/file-manager.module'
import { IndicatorRepository } from '@modules/evaluation/repositories'
import { UploadInterviewService, UploadEvaluationPlanService } from './services/evaluation'

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
      Interview
    ]),
    PublicModule,
    forwardRef(() => ModelModule),
    forwardRef(() => AuditorModule),
    forwardRef(() => EvaluatorModule),
    forwardRef(() => OrganizationalUnitModule),
    FileManagerModule
  ],
  controllers: [EvaluationController, IndicatorController, AdjustmentController],
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
    UploadEvaluationPlanService
  ],
  exports: [TypeOrmModule, ListEvaluationsService]
})
export class EvaluationModule {}
