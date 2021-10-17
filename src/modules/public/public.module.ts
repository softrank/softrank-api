import {
  CreateCommonEntityService,
  CreateUserRoleService,
  CreateUserService,
  EncrypterService,
  HasherService,
  LoginService
} from '@modules/public/services'
import { User, CommonEntity } from '@modules/public/entities'
import { UserController } from '@modules/public/controller'
import { AuthorizationGuard } from '@modules/public/guards'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import { UserRole } from './entities/user-role.entity'

@Module({
  imports: [TypeOrmModule.forFeature([User, CommonEntity, UserRole])],
  providers: [
    CreateCommonEntityService,
    CreateUserService,
    EncrypterService,
    HasherService,
    CreateUserService,
    LoginService,
    AuthorizationGuard,
    CreateUserRoleService
  ],
  controllers: [UserController],
  exports: [
    TypeOrmModule,
    CreateCommonEntityService,
    CreateUserService,
    AuthorizationGuard,
    EncrypterService,
    CreateUserRoleService
  ]
})
export class PublicModule {}
