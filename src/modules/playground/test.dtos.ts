import { ApiProperty } from '@nestjs/swagger'

export class TestDto {
  @ApiProperty()
  name: string
}
