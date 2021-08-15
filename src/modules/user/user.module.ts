import { userProviders } from '@modules/user/user.providers'
import { DatabaseModule } from '@config/db/database.module'
import { UserRepository } from '@modules/user/repositories'
import { AuthController } from '@modules/user/controllers'
import { Module } from '@nestjs/common'
import {
  CreateUserService,
  HasherService,
  EncrypterService,
  SignInService
} from '@modules/user/services'

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [
    UserRepository,
    CreateUserService,
    HasherService,
    EncrypterService,
    SignInService,
    ...userProviders
  ],
  exports: [CreateUserService, UserRepository, EncrypterService]
})
export class UserModule {}
