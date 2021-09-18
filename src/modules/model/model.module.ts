import { ModelController } from '@modules/model/controllers'
import { DatabaseModule } from '@config/db/database.module'
import { Module } from '@nestjs/common'
import { modelProviders } from './model.providers'
import {
  CreateModelService,
  GetModelService,
  UpdateModelService
} from '@modules/model/services'
import { ModelRepository } from './repositories'

@Module({
  imports: [DatabaseModule],
  controllers: [ModelController],
  providers: [
    CreateModelService,
    GetModelService,
    UpdateModelService,
    ModelRepository,
    ...modelProviders
  ]
})
export class ModelModule {}
