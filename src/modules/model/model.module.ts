import {
  CreateModelService,
  GetModelService,
  UpdateModelService,
  CreateExpectedResultService,
  CreateModelLevelService,
  CreateModelProcessService,
  UpdateModelProcessService,
  UpdateModelLevelService,
  UpdateExpectedResultService
} from '@modules/model/services'
import { ExpectedResult, ModelProcess, ModelLevel, Model } from '@modules/model/entities'
import { ModelRepository } from '@modules/model/repositories'
import { ModelController } from '@modules/model/controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([ExpectedResult, ModelProcess, ModelLevel, Model, ModelRepository])],
  controllers: [ModelController],
  providers: [
    CreateModelService,
    GetModelService,
    UpdateModelService,
    CreateExpectedResultService,
    CreateModelLevelService,
    CreateModelProcessService,
    UpdateModelProcessService,
    UpdateModelLevelService,
    UpdateExpectedResultService
  ],
  exports: [TypeOrmModule]
})
export class ModelModule {}
