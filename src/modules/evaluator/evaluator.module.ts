import { Evaluator, EvaluatorLicense } from '@modules/evaluator/entities'
import { CreateEvaluatorService } from '@modules/evaluator/services'
import { EvaluatorController } from '@modules/evaluator/controller'
import { PublicModule } from '@modules/public/public.module'
import { ModelModule } from '@modules/model/model.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([Evaluator, EvaluatorLicense]), PublicModule, ModelModule],
  providers: [CreateEvaluatorService],
  controllers: [EvaluatorController],
  exports: [TypeOrmModule]
})
export class EvaluatorModule {}
