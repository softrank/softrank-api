import { EvaluatorInstitutionModule } from '@modules/evaluator-institution/evaluator-institution.module'
import { OrganizationalUnitModule } from '@modules/organizational-unit/organizational-unit.module'
import { EvaluatorModule } from '@modules/evaluator/evaluator.module'
import { AuditorModule } from '@modules/auditor/auditor.module'
import { PublicModule } from '@modules/public/public.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { ModelModule } from '@modules/model'
import { Module } from '@nestjs/common'
import { EvaluationModule } from './modules/evaluation/evaluation.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => await getConnectionOptions()
    }),
    ModelModule,
    PublicModule,
    EvaluatorModule,
    EvaluatorInstitutionModule,
    AuditorModule,
    OrganizationalUnitModule,
    EvaluationModule
  ]
})
export class AppModule {}
