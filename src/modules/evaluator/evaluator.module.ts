import {
  CreateEvaluatorService,
  GetEvaluatorsService,
  GetEvaluatorService,
  CreateEvaluatorLicenseService,
  UpdateEvaluatorService,
  UpdateEvaluatorLicenseService
} from '@modules/evaluator/services'
import { Evaluator, EvaluatorLicense } from '@modules/evaluator/entities'
import { EvaluatorRepository } from '@modules/evaluator/repositories'
import { EvaluatorController } from '@modules/evaluator/controller'
import { PublicModule } from '@modules/public/public.module'
import { ModelModule } from '@modules/model/model.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([Evaluator, EvaluatorLicense, EvaluatorRepository]), PublicModule, ModelModule],
  providers: [
    CreateEvaluatorService,
    GetEvaluatorsService,
    GetEvaluatorService,
    CreateEvaluatorLicenseService,
    UpdateEvaluatorService,
    UpdateEvaluatorLicenseService
  ],
  controllers: [EvaluatorController],
  exports: [TypeOrmModule]
})
export class EvaluatorModule {}
