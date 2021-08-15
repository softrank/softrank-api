import { applyDecorators } from '@nestjs/common'
import { ApiOkResponse, ApiUnauthorizedResponse } from '@nestjs/swagger'
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation
} from '@nestjs/swagger'

export function CreateEvaluatorDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para criar um avaliador'
    }),
    ApiCreatedResponse({
      description: 'Avaliador criado com sucesso'
    }),
    ApiBadRequestResponse({
      description: 'Erro de requisição por parte do front'
    }),
    ApiConflictResponse({
      description: 'Email ou cpf de avaliador já existente'
    })
  ]
  return applyDecorators(...decorators)
}

export function EvaluatorMeDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para pegar as informações do avaliador'
    }),
    ApiOkResponse({
      description: 'Informações do avaliador'
    }),
    ApiUnauthorizedResponse({
      description: 'Não autorizado'
    })
  ]
  return applyDecorators(...decorators)
}
