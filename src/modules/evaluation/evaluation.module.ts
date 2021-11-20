import { TypeOrmModule } from '@nestjs/typeorm'
import { Module, forwardRef } from '@nestjs/common'
import { CreateEvaluationService, GenerateEvaluationIndicatorsService } from './services'
import { ModelModule } from '../model/model.module'
import { AuditorModule } from '../auditor/auditor.module'
import { EvaluatorModule } from '../evaluator/evaluator.module'
import { EvaluationController } from './controllers/evaluation.controller'
import { OrganizationalUnitModule } from '../organizational-unit/organizational-unit.module'
import { PublicModule } from '../public/public.module'
import { IndicatorFile } from './entities/indicator-files.entity'
import { FindEvaluationIndicatorsService } from './services/find-evaluation-indicators.service'
import {
  Evaluation,
  EvaluationIndicators,
  EvaluationMember,
  ExpectedResultIndicator,
  Indicator,
  IndicatorProject
} from './entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluation,
      EvaluationIndicators,
      EvaluationMember,
      ExpectedResultIndicator,
      Indicator,
      IndicatorProject,
      IndicatorFile
    ]),
    PublicModule,
    forwardRef(() => ModelModule),
    forwardRef(() => AuditorModule),
    forwardRef(() => EvaluatorModule),
    forwardRef(() => OrganizationalUnitModule)
  ],
  controllers: [EvaluationController],
  providers: [CreateEvaluationService, GenerateEvaluationIndicatorsService, FindEvaluationIndicatorsService],
  exports: [TypeOrmModule]
})
export class EvaluationModule {}
