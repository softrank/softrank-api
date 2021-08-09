import { CreateUserService, HasherService } from '@modules/user/services'
import { DatabaseModule } from '@config/db/database.module'
import { UserRepository } from '@modules/user/repositories'
import { userProviders } from '@modules/user/user.providers'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [
    UserRepository,
    CreateUserService,
    HasherService,
    ...userProviders
  ],
  exports: [CreateUserService]
})
export class UserModule {}
