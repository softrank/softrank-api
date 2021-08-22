import { SignInDocumentation } from '@modules/user/swagger'
import { Body, Controller, Post } from '@nestjs/common'
import { SignInService } from '@modules/user/services'
import { SignInDto } from '@modules/user/dtos'
import { ApiTags } from '@nestjs/swagger'
import { TestService } from './test.service'
import { TestDto } from './test.dtos'

@ApiTags('playgound')
@Controller('playground')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Post()
  @SignInDocumentation()
  async test(@Body() dto: TestDto): Promise<string> {
    return this.testService.create(dto)
  }
}
