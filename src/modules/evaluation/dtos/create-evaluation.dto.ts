import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsUUID, ArrayNotEmpty } from 'class-validator'

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

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID('4')
  implementationInstitutionId: string

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
    this.implementationInstitutionId = createEvaluationServiceBodyDto.implementationInstitutionId
    this.organizationalUnitId = createEvaluationServiceBodyDto.organizationalUnitId
    this.userId = userId
  }

  userId: string
}
