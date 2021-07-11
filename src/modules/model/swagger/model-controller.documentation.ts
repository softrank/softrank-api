import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation
} from '@nestjs/swagger'

export function CreateModelDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para criar um modelo'
    }),
    ApiCreatedResponse({
      description: 'Modelo criado com sucesso'
    }),
    ApiBadRequestResponse({
      description: 'Erro de requisição por parte do front'
    }),
    ApiConflictResponse({
      description: 'Nome de modelo já existente'
    })
  ]
  return applyDecorators(...decorators)
}

export function UpdateModelDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para atualizar o modelo'
    }),
    ApiCreatedResponse({
      description: 'Modelo criado com sucesso'
    }),
    ApiBadRequestResponse({
      description: 'Erro de requisição por parte do front'
    }),
    ApiNotFoundResponse({
      description: 'Modelo não encontrado'
    }),
    ApiConflictResponse({
      description: 'Nome de modelo já existente'
    })
  ]
  return applyDecorators(...decorators)
}

export function ListModelsDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para listar os modelos cadastrados'
    }),
    ApiOkResponse({
      description: 'Listagem dos modelos cadastrados'
    })
  ]
  return applyDecorators(...decorators)
}

export function GetModelByIdDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para pegar um modelo pelo id'
    }),
    ApiOkResponse({
      description: 'Modelo encontrado'
    }),
    ApiNotFoundResponse({
      description: 'Modelo não encontrado'
    })
  ]
  return applyDecorators(...decorators)
}
