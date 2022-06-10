import { ApiBadRequestResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { GetModelService, CreateModelService, UpdateModelService } from '@modules/model/services'
import { CreateModelDto, UpdateModelBodyDto, UpdateModelDto } from '@modules/model/dtos'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { uuidParamValidation } from '@utils/validations'
import { ModelDto } from '@modules/shared/dtos/model'
import { RouteGuards } from '../../shared/decorators/route-guards.decorator'
import { AuthorizedUser } from '../../shared/decorators/authorized-user.decorator'
import { AuthorizedUserDto } from '../../shared/dtos/public/authorized-user.dto'

@ApiTags('Model')
@Controller('models')
export class ModelController {
  constructor(
    private readonly createModelService: CreateModelService,
    private readonly getModelService: GetModelService,
    private readonly updateModelService: UpdateModelService
  ) {}

  @Post()
  @RouteGuards()
  @ApiCreatedResponse({ description: 'Modelo criado com sucesso' })
  @ApiBadRequestResponse({ description: 'Erro de requisição por parte do front' })
  async createModel(@Body() createModelDto: CreateModelDto, @AuthorizedUser() user: AuthorizedUserDto): Promise<ModelDto> {
    return this.createModelService.create(createModelDto, user.id)
  }

  @Put(':id')
  @ApiOkResponse({ description: 'Modelo atualizado com sucesso' })
  @ApiBadRequestResponse({ description: 'Erro de requisição por parte do front' })
  @RouteGuards()
  async updateModel(@Body() updateModelBodyDto: UpdateModelBodyDto, @Param('id', uuidParamValidation()) id: string): Promise<ModelDto> {
    const updateModelDto = new UpdateModelDto(Object.assign(updateModelBodyDto, { id }))
    return this.updateModelService.update(updateModelDto)
  }

  @Get()
  @ApiOkResponse({ description: 'Modelos buscados com sucesso' })
  async listModels(): Promise<ModelDto[]> {
    return this.getModelService.listModels()
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Modelo buscado com sucesso' })
  @ApiNotFoundResponse({ description: 'Id do modelo não existente' })
  async getModelById(@Param('id', uuidParamValidation()) id: string): Promise<ModelDto> {
    return this.getModelService.getById(id)
  }
}
