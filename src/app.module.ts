import { EntityModule } from '@modules/entity'
import { ModelModule } from '@modules/model'
import { UserModule } from '@modules/user'
import { Module } from '@nestjs/common'
import { TestModule } from './modules/playground/test.module'

@Module({
  imports: [ModelModule, EntityModule, UserModule, TestModule]
})
export class AppModule {}
