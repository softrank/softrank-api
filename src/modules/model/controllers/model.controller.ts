import { Body, Controller, Post } from '@nestjs/common'
import { CreateModelService } from '../services/create-model.service'
import { CreateModelDto } from '../dto/create-model.dto'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags
} from '@nestjs/swagger'

@Controller()
export class ModulController {
  constructor(private readonly createModelService: CreateModelService) {}

  @ApiTags('Model')
  @Post()
  @ApiCreatedResponse({
    description: 'Modelo criado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Erro de requisição por parte do front'
  })
  async createModel(@Body() createModelDto: CreateModelDto): Promise<any> {
    return this.createModelService.create(createModelDto)
  }
}
