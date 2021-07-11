import { ModelModule } from '@modules/model'
import { Module } from '@nestjs/common'

@Module({
  imports: [ModelModule]
})
export class AppModule {}
