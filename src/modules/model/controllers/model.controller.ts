import { GetModelService, CreateModelService } from '@modules/model/services'
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { uuidParamValidation } from '@utils/validations'
import { CreateModelDto, UpdateModelBodyDto } from '@modules/model/dtos'
import { ModelEntity } from '@modules/model/entities'
import { UpdateModelService } from '../services/update-model.service'
import { UpdateModelDto } from '../dtos/update-model.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'

@ApiTags('Model')
@Controller('models')
export class ModelController {
  constructor(
    private readonly createModelService: CreateModelService,
    private readonly getModelService: GetModelService,
    private readonly updateModelService: UpdateModelService
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Modelo criado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Erro de requisição por parte do front'
  })
  async createModel(
    @Body() createModelDto: CreateModelDto
  ): Promise<ModelEntity> {
    return this.createModelService.create(createModelDto)
  }

  @Put(':id')
  @ApiOkResponse({
    description: 'Modelo atualizado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Erro de requisição por parte do front'
  })
  async updateModel(
    @Body() updateModelBodyDto: UpdateModelBodyDto,
    @Param('id', uuidParamValidation()) id: string
  ): Promise<ModelEntity> {
    const updateModelDto = new UpdateModelDto(
      Object.assign(updateModelBodyDto, { id })
    )
    return this.updateModelService.update(updateModelDto)
  }

  @Get()
  @ApiOkResponse({
    description: 'Modelos buscados com sucesso'
  })
  async listModels(): Promise<ModelEntity[]> {
    return this.getModelService.listModels()
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Modelo buscado com sucesso'
  })
  @ApiNotFoundResponse({
    description: 'Id do modelo não existente'
  })
  async getModelById(
    @Param('id', uuidParamValidation()) id: string
  ): Promise<ModelEntity> {
    return this.getModelService.getById(id)
  }
}
