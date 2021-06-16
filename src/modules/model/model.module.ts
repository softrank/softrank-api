import { ModulController } from '@modules/model/controllers'
import { CreateModelService } from '@modules/model/services'
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
  controllers: [ModulController],
  providers: [CreateModelService]
})
export class ModelModule {}
