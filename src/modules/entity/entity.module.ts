import {
  CreateEvaluatorService,
  GetEvaluatorService
} from '@modules/entity/services'
import {
  UnproctedEvaluatorController,
  ProctedEvaluatorController
} from '@modules/entity/controllers'
import { EntityRepository } from '@modules/entity/repositories'
import { DatabaseModule } from '@config/db/database.module'
import { entityProviders } from './entity.providers'
import { UserModule } from '@modules/user'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [UnproctedEvaluatorController, ProctedEvaluatorController],
  providers: [
    EntityRepository,
    CreateEvaluatorService,
    GetEvaluatorService,
    ...entityProviders
  ]
})
export class EntityModule {}
