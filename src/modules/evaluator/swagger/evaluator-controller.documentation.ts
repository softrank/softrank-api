import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiOkResponse
} from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'
import { ApiNotFoundResponse } from '@nestjs/swagger'

export function CreateEvaluatorDcoumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para criação do avaliador' }),
    ApiCreatedResponse({ description: 'Avaliador criado com sucesso' }),
    ApiBadRequestResponse({ description: 'Erro de requisição por parte do front-end' }),
    ApiConflictResponse({ description: 'Avaliador ou usuário já existente' })
  ]

  return applyDecorators(...decorators)
}

export function GetEvaluatorsDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para pegar os avaliadores' }),
    ApiOkResponse({ description: 'Listagem de avaliadores realizada com sucesso' })
  ]

  return applyDecorators(...decorators)
}

export function GetEvaluatorDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para pegar os avaliadore' }),
    ApiOkResponse({ description: 'Avaliadores localizado com sucesso' }),
    ApiNotFoundResponse({ description: 'Avaliador não encontrado' })
  ]

  return applyDecorators(...decorators)
}

export function UpdateEvaluatorDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para atualizar dados do avaliador' }),
    ApiOkResponse({ description: 'Avaliador atualizado com sucesso' }),
    ApiNotFoundResponse({ description: 'Algum recurso requerido não encontrado' }),
    ApiConflictResponse({ description: 'Licença de avaliador já existente' }),
    ApiBadRequestResponse({ description: 'Erro de requisição por parte do front-end' })
  ]

  return applyDecorators(...decorators)
}
