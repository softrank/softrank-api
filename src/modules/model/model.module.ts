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
  CreateModelManagerService,
  ModelManagerMeService,
  CreateModelCapacityService,
  UpdateModelCapacityService
} from '@modules/model/services'
import { ExpectedResult, ModelProcess, ModelLevel, Model, ModelCapacity } from '@modules/model/entities'
import { ModelRepository } from '@modules/model/repositories'
import { ModelController, ModelManagerController } from '@modules/model/controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { PublicModule } from '../public/public.module'
import { ModelManager } from './entities/model-manager.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpectedResult, ModelProcess, ModelLevel, Model, ModelRepository, ModelManager, ModelCapacity]),
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
    CreateModelManagerService,
    ModelManagerMeService,
    CreateModelCapacityService,
    UpdateModelCapacityService
  ],
  exports: [TypeOrmModule]
})
export class ModelModule {}
