import { CreateOrganizationalUnitService, FindOrganizationalUnitByIdService } from './services'
import { OrganizationalUnitRepository } from './repositories'
import { OrganizationalUnitController } from './controllers'
import { PublicModule } from '@modules/public/public.module'
import { OrganizationalUnit, OrganizationalUnitProject } from './entities'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganizationalUnit, OrganizationalUnitProject, OrganizationalUnitRepository]),
    PublicModule
  ],
  controllers: [OrganizationalUnitController],
  providers: [CreateOrganizationalUnitService, FindOrganizationalUnitByIdService],
  exports: [TypeOrmModule]
})
export class OrganizationalUnitModule {}
