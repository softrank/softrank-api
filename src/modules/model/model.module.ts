import { CreateModelService, GetModelService, UpdateModelService } from '@modules/model/services'
import { ExpectedResult, ModelProcess, ModelLevel, Model } from '@modules/model/entities'
import { ModelController } from '@modules/model/controllers'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([ExpectedResult, ModelProcess, ModelLevel, Model])],
  controllers: [ModelController],
  providers: [CreateModelService, GetModelService, UpdateModelService],
  exports: [TypeOrmModule]
})
export class ModelModule {}
