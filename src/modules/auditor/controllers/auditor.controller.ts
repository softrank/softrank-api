import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Get, Post, Param } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuditorDto } from '../../shared/dtos/auditor/auditor.dto'
import { CreateAuditorBodyDto, CreateAuditorDto } from '../dtos/create-auditor.dto'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { CreateAuditorService, FindAuditorByIdService } from '../services'
import { uuidParamValidation } from '../../../utils/validations/uuid-param.validation'

@Controller('auditor')
@ApiTags('Auditor')
@RouteGuards()
export class AuditorController {
  constructor(
    private readonly createAuditorService: CreateAuditorService,
    private readonly findAuditorByIdService: FindAuditorByIdService
  ) {}

  @Post()
  public createAuditor(
    @Body() createAuditorBodyDto: CreateAuditorBodyDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<AuditorDto> {
    const createAuditorDto = new CreateAuditorDto(user.id, createAuditorBodyDto)
    return this.createAuditorService.create(createAuditorDto)
  }

  @Get('me')
  public auditorMe(@AuthorizedUser() user: AuthorizedUserDto): Promise<AuditorDto> {
    return this.findAuditorByIdService.find(user.id)
  }

  @Get(':id')
  public findAuditorById(@Param('id', uuidParamValidation()) auditorId: string): Promise<AuditorDto> {
    return this.findAuditorByIdService.find(auditorId)
  }
}
