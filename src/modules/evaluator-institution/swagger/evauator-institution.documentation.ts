import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiConflictResponse } from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function CreateEvaluatorInstitutionDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para criar uma instituição avaliadora' }),
    ApiCreatedResponse({ description: 'Instituição avaliadora criada com sucesso' }),
    ApiBadRequestResponse({ description: 'Erro de requisição por parte do front-end' }),
    ApiConflictResponse({ description: 'Email ou número de documento já existente' })
  ]

  return applyDecorators(...decorators)
}
