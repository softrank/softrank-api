import {
  CreateEvaluatorService,
  FindEvaluatorsService,
  FindEvaluatorByIdService,
  CreateEvaluatorLicenseService,
  UpdateEvaluatorService,
  UpdateEvaluatorLicenseService
} from '@modules/evaluator/services'
import { Evaluator, EvaluatorLicense } from '@modules/evaluator/entities'
import { EvaluatorRepository } from '@modules/evaluator/repositories'
import { EvaluatorController } from '@modules/evaluator/controller'
import { PublicModule } from '@modules/public/public.module'
import { EvaluatorInstitutionModule } from '@modules/evaluator-institution/evaluator-institution.module'
import { ModelModule } from '@modules/model/model.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { forwardRef, Module } from '@nestjs/common'

@Module({
  imports: [
    TypeOrmModule.forFeature([Evaluator, EvaluatorLicense, EvaluatorRepository]),
    PublicModule,
    ModelModule,
    forwardRef(() => EvaluatorInstitutionModule)
  ],
  providers: [
    CreateEvaluatorService,
    FindEvaluatorsService,
    FindEvaluatorByIdService,
    CreateEvaluatorLicenseService,
    UpdateEvaluatorService,
    UpdateEvaluatorLicenseService
  ],
  controllers: [EvaluatorController],
  exports: [TypeOrmModule]
})
export class EvaluatorModule {}
