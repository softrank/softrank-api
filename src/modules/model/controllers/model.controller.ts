import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { uuidParamValidation } from '@utils/validations'
import { ModelEntity } from '@modules/model/entities'
import { ApiTags } from '@nestjs/swagger'
import {
  CreateModelDto,
  UpdateModelBodyDto,
  UpdateModelDto
} from '@modules/model/dtos'
import {
  CreateModelDocumentation,
  UpdateModelDocumentation,
  GetModelByIdDocumentation,
  ListModelsDocumentation
} from '@modules/model/swagger'
import {
  GetModelService,
  CreateModelService,
  UpdateModelService
} from '@modules/model/services'

@ApiTags('Model')
@Controller('models')
export class ModelController {
  constructor(
    private readonly createModelService: CreateModelService,
    private readonly getModelService: GetModelService,
    private readonly updateModelService: UpdateModelService
  ) {}

  @Post()
  @CreateModelDocumentation()
  async createModel(
    @Body() createModelDto: CreateModelDto
  ): Promise<ModelEntity> {
    return this.createModelService.create(createModelDto)
  }

  @Put(':id')
  @UpdateModelDocumentation()
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
  @ListModelsDocumentation()
  async listModels(): Promise<ModelEntity[]> {
    return this.getModelService.listModels()
  }

  @Get(':id')
  @GetModelByIdDocumentation()
  async getModelById(
    @Param('id', uuidParamValidation()) id: string
  ): Promise<ModelEntity> {
    return this.getModelService.getById(id)
  }
}
