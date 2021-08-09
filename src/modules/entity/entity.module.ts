import { CreateEvaluatorService } from '@modules/entity/services'
import { EvaluatorController } from '@modules/entity/controllers'
import { EntityRepository } from '@modules/entity/repositories'
import { DatabaseModule } from '@config/db/database.module'
import { entityProviders } from './entity.providers'
import { UserModule } from '@modules/user'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [EvaluatorController],
  providers: [EntityRepository, CreateEvaluatorService, ...entityProviders]
})
export class EntityModule {}
