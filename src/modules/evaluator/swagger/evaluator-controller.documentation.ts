import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiQuery
} from '@nestjs/swagger'
import { ApiNotFoundResponse } from '@nestjs/swagger'
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

export function ListEvaluatorEvaluationsDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para listar avaliações do avaliador logado' }),
    ApiOkResponse({ description: 'avaliações listadas com sucesso' }),
    ApiQuery({ name: 'page', required: false, type: 'string' }),
    ApiQuery({ name: 'limit', required: false, type: 'string' })
  ]

  return applyDecorators(...decorators)
}
