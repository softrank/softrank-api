import { EvaluationMemberDto } from '.'
import { ModelLevelDto } from '../model'
import { OrganizationalUnitDto } from '../organizational-unit'

export class EvaluationDto {
  id: string
  name: string
  start: Date
  end: Date
  implementationInstitution: string
  orgranizationalUnit: OrganizationalUnitDto
  expectedModelLevel: ModelLevelDto
  members: EvaluationMemberDto[]
}
