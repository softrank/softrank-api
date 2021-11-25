import { IsNotEmpty, IsUUID, ArrayNotEmpty, IsString, IsDateString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEvaluationServiceBodyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  organizationalUnitId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  expectedModelLevelId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  auditorId: string

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  evaluatorInstitutionId: string

  // @ApiProperty()
  // @IsNotEmpty()
  // @IsUUID('4')
  // implementationInstitutionId: string

  @ApiProperty({ example: '2021/12/25' })
  @IsNotEmpty()
  @IsDateString({ strict: true })
  start: string

  @ApiProperty({ example: '2021/12/26' })
  @IsNotEmpty()
  @IsDateString({ strict: true })
  end: string

  @ApiProperty({ example: 'Instituição implementadora' })
  @IsNotEmpty()
  @IsString()
  implementationInstitution: string

  @ApiProperty({ example: 'Avaliação do Jorginho' })
  @IsNotEmpty()
  @IsString()
  name: string

  @ApiProperty()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  evaluatorsIds: string[]
}

export class CreateEvaluationServiceDto extends CreateEvaluationServiceBodyDto {
  constructor(userId: string, createEvaluationServiceBodyDto: CreateEvaluationServiceBodyDto) {
    super()

    this.auditorId = createEvaluationServiceBodyDto.auditorId
    this.evaluatorInstitutionId = createEvaluationServiceBodyDto.evaluatorInstitutionId
    this.evaluatorsIds = createEvaluationServiceBodyDto.evaluatorsIds
    this.expectedModelLevelId = createEvaluationServiceBodyDto.expectedModelLevelId
    this.implementationInstitution = createEvaluationServiceBodyDto.implementationInstitution
    this.organizationalUnitId = createEvaluationServiceBodyDto.organizationalUnitId
    this.name = createEvaluationServiceBodyDto.name
    this.start = createEvaluationServiceBodyDto.start
    this.end = createEvaluationServiceBodyDto.end
    this.userId = userId
  }

  userId: string
}
