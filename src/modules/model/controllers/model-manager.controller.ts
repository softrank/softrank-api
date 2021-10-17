import { ModelManagerDto } from '@modules/shared/dtos/model'
import { Body, Controller, Post } from '@nestjs/common'
import { CreateModelManagerBodyDto, CreateModelManagerDto } from '../dtos/create-model-manager.dto'
import { CreateModelManagerService } from '../services/create-model-manager.service'
import { AuthorizedUser } from '../../shared/decorators/authorized-user.decorator'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'
import { ApiTags } from '@nestjs/swagger'
import { RouteGuards } from '@modules/shared/decorators'

@ApiTags('Model Manager')
@RouteGuards()
@Controller('model-managers')
export class ModelManagerController {
  constructor(private readonly createModelManagerService: CreateModelManagerService) {}

  @Post()
  public createModelManager(
    @Body() createModelManagerBodyDto: CreateModelManagerBodyDto,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<ModelManagerDto> {
    const createModelManagerDto = new CreateModelManagerDto(user.id, createModelManagerBodyDto)
    return this.createModelManagerService.create(createModelManagerDto)
  }
}
