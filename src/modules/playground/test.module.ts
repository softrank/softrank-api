import { DatabaseModule } from '@config/db/database.module'
import { Module } from '@nestjs/common'
import { TestRepository } from './test.repository'
import { TestService } from './test.service'
import { TestController } from './test.controller'
import { testProviders } from './test.provider'

@Module({
  imports: [DatabaseModule],
  controllers: [TestController],
  providers: [TestRepository, TestService, ...testProviders],
  exports: []
})
export class TestModule {}
