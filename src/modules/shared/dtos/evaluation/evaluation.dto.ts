import { EvaluationMemberDto } from '.'
import { ModelLevelDto } from '../model'
import { OrganizationalUnitDto } from '../organizational-unit'

export class EvaluationDto {
  id: string
  orgranizationalUnit: OrganizationalUnitDto
  expectedModelLevel: ModelLevelDto
  members: EvaluationMemberDto[]
}
