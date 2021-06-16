import { ModelController } from '@modules/model/controllers'
import { CreateModelService, GetModelService } from '@modules/model/services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
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
  providers: [CreateModelService, GetModelService]
})
export class ModelModule {}
