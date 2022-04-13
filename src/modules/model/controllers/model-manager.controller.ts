import { ModelManagerDto } from '@modules/shared/dtos/model'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { CreateModelManagerDto } from '../dtos/create-model-manager.dto'
import { CreateModelManagerService, ModelManagerMeService } from '../services'
import { AuthorizedUser } from '../../shared/decorators/authorized-user.decorator'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { RouteGuards } from '@modules/shared/decorators'

@ApiTags('Model Manager')
@Controller('model-managers')
export class ModelManagerController {
  constructor(
    private readonly createModelManagerService: CreateModelManagerService,
    private readonly modelManagerMeService: ModelManagerMeService
  ) {}

  @Post()
  public createModelManager(
    @Body() createModelManagerBodyDto: CreateModelManagerDto
  ): Promise<ModelManagerDto> {
    return this.createModelManagerService.create(createModelManagerBodyDto)
  }

  @Get('me')
  @RouteGuards()
  public modelManagerMe(@AuthorizedUser() user: AuthorizedUserDto): Promise<ModelManagerDto> {
    return this.modelManagerMeService.me(user.id)
  }
}
