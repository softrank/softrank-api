import {
  CreateModelService,
  GetModelService,
  UpdateModelService,
  CreateExpectedResultService,
  CreateModelLevelService,
  CreateModelProcessService,
  UpdateModelProcessService,
  UpdateModelLevelService,
  UpdateExpectedResultService,
  CreateModelManagerService
} from '@modules/model/services'
import { ExpectedResult, ModelProcess, ModelLevel, Model } from '@modules/model/entities'
import { ModelRepository } from '@modules/model/repositories'
import { ModelController, ModelManagerController } from '@modules/model/controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { PublicModule } from '../public/public.module'
import { ModelManager } from './entities/model-manager.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpectedResult,
      ModelProcess,
      ModelLevel,
      Model,
      ModelRepository,
      ModelManager
    ]),
    PublicModule
  ],
  controllers: [ModelController, ModelManagerController],
  providers: [
    CreateModelService,
    GetModelService,
    UpdateModelService,
    CreateExpectedResultService,
    CreateModelLevelService,
    CreateModelProcessService,
    UpdateModelProcessService,
    UpdateModelLevelService,
    UpdateExpectedResultService,
    CreateModelManagerService
  ],
  exports: [TypeOrmModule]
})
export class ModelModule {}
