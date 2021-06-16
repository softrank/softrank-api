import { GetModelService, CreateModelService } from '@modules/model/services'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { CreateModelDto } from '@modules/model/dtos'
import { Model } from '@modules/model/entities'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags
} from '@nestjs/swagger'

@ApiTags('Model')
@Controller('models')
export class ModulController {
  constructor(
    private readonly createModelService: CreateModelService,
    private readonly getModelService: GetModelService
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Modelo criado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Erro de requisição por parte do front'
  })
  async createModel(@Body() createModelDto: CreateModelDto): Promise<Model> {
    return this.createModelService.create(createModelDto)
  }

  @Get()
  @ApiOkResponse({
    description: 'Modelos buscados com sucesso'
  })
  async listModels(): Promise<Model[]> {
    return this.getModelService.listModels()
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Modelo buscado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Id do modelo não existente'
  })
  async getModelById(@Param('id') id: string): Promise<Model> {
    return this.getModelService.getById(id)
  }
}
