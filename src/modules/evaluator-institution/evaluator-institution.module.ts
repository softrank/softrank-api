import { EvaluatorInstitutionAddress, EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { EvaluatorInstitutionController } from '@modules/evaluator-institution/controllers'
import {
  CreateEvaluatorInstitutionService,
  FindEvaluatorInstitution,
  ListEvaluatorInstitutionsService
} from '@modules/evaluator-institution/services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { PublicModule } from '@modules/public/public.module'

@Module({
  imports: [TypeOrmModule.forFeature([EvaluatorInstitutionAddress, EvaluatorInstitution]), PublicModule],
  controllers: [EvaluatorInstitutionController],
  providers: [CreateEvaluatorInstitutionService, FindEvaluatorInstitution, ListEvaluatorInstitutionsService],
  exports: [TypeOrmModule]
})
export class EvaluatorInstitutionModule {}
