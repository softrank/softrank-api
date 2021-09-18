import { UpdateExpectedResultDto } from '@modules/model/dtos'
import { ModelProcessEntity } from '@modules/model/entities'
import { ApiProperty } from '@nestjs/swagger'
import { v4 } from 'uuid'

export class UpdateModelProcessDto {
  @ApiProperty({
    example: v4(),
    required: false
  })
  id?: string

  @ApiProperty({
    example: 'Gerencia de Projetos'
  })
  name: string

  @ApiProperty({
    example: 'GPR'
  })
  initial: string

  @ApiProperty({
    example: 'Responsável por gerenciar o projeto'
  })
  description: string

  @ApiProperty({
    type: () => [UpdateExpectedResultDto],
    required: false
  })
  expectedResults?: UpdateExpectedResultDto[]

  static toEntity(
    updateModelProcessDto: UpdateModelProcessDto
  ): ModelProcessEntity {
    const modelProcess = new ModelProcessEntity()

    modelProcess.id = updateModelProcessDto.id
    modelProcess.name = updateModelProcessDto.name
    modelProcess.initial = updateModelProcessDto.initial
    modelProcess.description = updateModelProcessDto.description
    modelProcess.expectedResults = updateModelProcessDto.expectedResults?.map(
      UpdateExpectedResultDto.toEntity
    )

    return modelProcess
  }
}
