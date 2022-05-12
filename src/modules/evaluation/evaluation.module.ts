import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import {
  CreateEvaluationService,
  GenerateEvaluationIndicatorsService,
  CreateIndicatorService,
  FindEvaluationIndicatorsService,
  UpdateIndicatorService,
  UploadIndicatorFileService,
  ListEvaluationsService,
  ListEvaluationProcessesService,
  FindEvaluationService
} from './services'
import { ModelModule } from '../model/model.module'
import { AuditorModule } from '../auditor/auditor.module'
import { EvaluatorModule } from '../evaluator/evaluator.module'
import { EvaluationController, IndicatorController } from './controllers'
import { OrganizationalUnitModule } from '../organizational-unit/organizational-unit.module'
import { PublicModule } from '../public/public.module'
import { IndicatorFile } from './entities/indicator-files.entity'
import {
  Evaluation,
  EvaluationIndicators,
  EvaluationMember,
  ExpectedResultIndicator,
  Indicator,
  IndicatorProject,
  EvaluationProject
} from './entities'
import { FileManagerModule } from '@modules/file-manager/file-manager.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluation,
      EvaluationIndicators,
      EvaluationMember,
      ExpectedResultIndicator,
      Indicator,
      IndicatorProject,
      IndicatorFile,
      EvaluationProject
    ]),
    PublicModule,
    forwardRef(() => ModelModule),
    forwardRef(() => AuditorModule),
    forwardRef(() => EvaluatorModule),
    forwardRef(() => OrganizationalUnitModule),
    FileManagerModule
  ],
  controllers: [EvaluationController, IndicatorController],
  providers: [
    CreateEvaluationService,
    GenerateEvaluationIndicatorsService,
    FindEvaluationIndicatorsService,
    CreateIndicatorService,
    UpdateIndicatorService,
    UploadIndicatorFileService,
    ListEvaluationsService,
    ListEvaluationProcessesService,
    FindEvaluationService
  ],
  exports: [TypeOrmModule, ListEvaluationsService]
})
export class EvaluationModule {}
