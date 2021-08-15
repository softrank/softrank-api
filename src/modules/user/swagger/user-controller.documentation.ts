import { applyDecorators } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger'

export function SignInDocumentation() {
  const decorators = [
    ApiOperation({
      summary: 'Rota para realizar o login'
    }),
    ApiOkResponse({
      description: 'Avaliador criado com sucesso'
    }),
    ApiBadRequestResponse({
      description: 'Erro de requisição por parte do front'
    }),
    ApiUnauthorizedResponse({
      description: 'Não autorizado'
    })
  ]
  return applyDecorators(...decorators)
}
