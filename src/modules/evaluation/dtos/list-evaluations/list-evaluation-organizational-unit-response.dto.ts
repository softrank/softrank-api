import { OrganizationalUnit } from '@modules/organizational-unit/entities'

export class ListEvaluationOrganizationalUnitResponseDto {
  id: string
  name: string

  static fromEntity(organizationalUnit: OrganizationalUnit): ListEvaluationOrganizationalUnitResponseDto {
    const listEvaluationOrganizationalUnitResponseDto = new ListEvaluationOrganizationalUnitResponseDto()

    listEvaluationOrganizationalUnitResponseDto.id = organizationalUnit.id
    listEvaluationOrganizationalUnitResponseDto.name = organizationalUnit.commonEntity?.name

    return listEvaluationOrganizationalUnitResponseDto
  }
}
