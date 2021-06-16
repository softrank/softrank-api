import { Controller, Post } from '@nestjs/common'
import { CreateModelService } from '../services/create-model.service'
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags
} from '@nestjs/swagger'

@Controller()
export class ModuleController {
  constructor(private readonly appService: CreateModelService) {}

  @ApiTags('Model')
  @Post()
  @ApiCreatedResponse({
    description: 'Modelo criado com sucesso'
  })
  @ApiBadRequestResponse({
    description: 'Erro de requisição por parte do front'
  })
  async createModel(): Promise<any> {
    return this.appService.create()
  }
}
