import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuditorController } from './controllers/auditor.controller'
import { Auditor } from './entities/auditor.entity'
import { PublicModule } from '../public/public.module'
import { CreateAuditorService, FindAuditorByIdService, FindAuditorsService } from './services'

@Module({
  imports: [TypeOrmModule.forFeature([Auditor]), PublicModule],
  controllers: [AuditorController],
  providers: [CreateAuditorService, FindAuditorByIdService, FindAuditorsService],
  exports: [TypeOrmModule]
})
export class AuditorModule {}
