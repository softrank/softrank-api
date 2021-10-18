import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { ModelModule } from '@modules/model'
import { Module } from '@nestjs/common'
import { PublicModule } from '@modules/public/public.module'
import { EvaluatorModule } from '@modules/evaluator/evaluator.module'
import { EvaluatorInstitutionModule } from '@modules/evaluator-institution/evaluator-institution.module'
import { AuditorModule } from '@modules/auditor/auditor.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => await getConnectionOptions()
    }),
    ModelModule,
    PublicModule,
    EvaluatorModule,
    EvaluatorInstitutionModule,
    AuditorModule
  ]
})
export class AppModule {}
