import { CreateCommonEntityService } from '@modules/public/services'
import { CreateUserService } from './services/create-user.service'
import { AuthorizationGuard } from './guards/authorization.guard'
import { EncrypterService } from './services/encrypter.service'
import { User, CommonEntity } from '@modules/public/entities'
import { UserController } from './controller/user.controller'
import { HasherService } from './services/hasher.service'
import { LoginService } from './services/login.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [TypeOrmModule.forFeature([User, CommonEntity])],
  providers: [
    CreateCommonEntityService,
    CreateUserService,
    EncrypterService,
    HasherService,
    CreateUserService,
    LoginService,
    AuthorizationGuard
  ],
  controllers: [UserController],
  exports: [TypeOrmModule, CreateCommonEntityService, CreateUserService, AuthorizationGuard, EncrypterService]
})
export class PublicModule {}
