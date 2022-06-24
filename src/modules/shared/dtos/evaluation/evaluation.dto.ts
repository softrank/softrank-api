import {
  EvaluationModelLevelResultDto,
  EvaluationModelProcessResultDto,
  EvaluationPlanDto,
  InterviewDto
} from '@modules/evaluation/dtos/entities'
import { evaluationStateMapper, TranslatedEvaluationStateEnum } from '@modules/evaluation/enums'
import { OrganizationalUnitDto } from '../organizational-unit'
import { EvaluationMemberDto, EvaluationProjectDto } from '.'
import { Evaluation } from '@modules/evaluation/entities'
import { ModelLevelDto } from '../model'

export class EvaluationDto {
  id: string
  name: string
  start: Date
  end: Date
  state: TranslatedEvaluationStateEnum
  implementationInstitution: string
  organizationalUnit: OrganizationalUnitDto
  expectedModelLevel: ModelLevelDto
  members: EvaluationMemberDto[]
  auditor: EvaluationMemberDto
  evaluators: EvaluationMemberDto[]
  evaluatorInsitution: EvaluationMemberDto
  projects: EvaluationProjectDto[]
  interviews: InterviewDto[]
  plan: EvaluationPlanDto
  modelProcessResults: EvaluationModelProcessResultDto[]
  modelLevelResults: EvaluationModelLevelResultDto[]

  static fromEntity(evaluation: Evaluation): EvaluationDto {
    const evaluationDto = new EvaluationDto()

    evaluationDto.id = evaluation.id
    evaluationDto.name = evaluation.name
    evaluationDto.start = evaluation.start
    evaluationDto.end = evaluation.end
    evaluationDto.state = evaluationStateMapper[evaluation.state]

    return evaluationDto
  }
}
