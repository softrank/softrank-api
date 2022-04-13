import { EvaluationMemberType } from '@modules/evaluation/enums'
import { EvaluationMember } from '@modules/evaluation/entities'

export class EvaluationMemberDto {
  id: string
  type: EvaluationMemberType
  memberId: string
  name: string

  static fromEntity(evaluationMember: EvaluationMember, name: string): EvaluationMemberDto {
    const evaluationMemberDto = new EvaluationMemberDto()

    evaluationMemberDto.id = evaluationMember.id
    evaluationMemberDto.type = evaluationMember.type
    evaluationMemberDto.memberId = evaluationMember.memberId
    evaluationMemberDto.name = name

    return evaluationMemberDto
  }
}
