import { ModelController } from '@modules/model/controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import {
  CreateModelService,
  GetModelService,
  UpdateModelService
} from '@modules/model/services'
import {
  ExpectedResult,
  ModelProcess,
  ModelLevel,
  Model
} from '@modules/model/entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpectedResult, ModelProcess, ModelLevel, Model])
  ],
  controllers: [ModelController],
  providers: [CreateModelService, GetModelService, UpdateModelService]
})
export class ModelModule {}
