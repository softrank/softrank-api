import {
  ApiNoContentResponse,
  ApiOperation,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiOkResponse
} from '@nestjs/swagger'
import { applyDecorators } from '@nestjs/common'

export function createUserControllerDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para criar um usuário' }),
    ApiNoContentResponse({ description: 'Usuário criado com sucesso' }),
    ApiBadRequestResponse({ description: 'Erro de requisição por parte do front-end' }),
    ApiConflictResponse({ description: 'Usuário já existente' })
  ]
  return applyDecorators(...decorators)
}

export function loginDocumentation(): MethodDecorator {
  const decorators = [
    ApiOperation({ summary: 'Rota para realizar o login' }),
    ApiOkResponse({ description: 'Usuário autorizado' }),
    ApiUnauthorizedResponse({ description: 'Usuário ou senha incorretos' })
  ]

  return applyDecorators(...decorators)
}
