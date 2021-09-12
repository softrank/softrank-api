import { ApiConflictResponse, ApiCreatedResponse, ApiOperation, ApiBadRequestResponse } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function CreateEvaluatorDcoumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para criação do avaliador' }),
    ApiCreatedResponse({ description: 'Avaliador criado com sucesso' }),
    ApiBadRequestResponse({ description: 'Erro de requisição por parte do front-end' }),
    ApiConflictResponse({ description: 'Avaliador ou usuário já existente' })
  ]

  return applyDecorators(...decorators)
}
