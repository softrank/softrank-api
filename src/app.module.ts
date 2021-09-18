import { EntityModule } from '@modules/entity'
import { ModelModule } from '@modules/model'
import { UserModule } from '@modules/user'
import { Module } from '@nestjs/common'

@Module({
  imports: [ModelModule, EntityModule, UserModule]
})
export class AppModule {}
