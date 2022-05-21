import { EvaluationMemberDto, EvaluationProjectDto } from '.'
import { ModelLevelDto } from '../model'
import { OrganizationalUnitDto } from '../organizational-unit'

export class EvaluationDto {
  id: string
  name: string
  start: Date
  end: Date
  implementationInstitution: string
  organizationalUnit: OrganizationalUnitDto
  expectedModelLevel: ModelLevelDto
  members: EvaluationMemberDto[]
  auditor: EvaluationMemberDto
  evaluators: EvaluationMemberDto[]
  evaluatorInsitution: EvaluationMemberDto
  projects: EvaluationProjectDto[]
}
