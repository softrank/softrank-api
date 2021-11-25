import { EvaluatorInstitution } from '@modules/evaluator-institution/entities'
import { OrganizationalUnit } from '@modules/organizational-unit/entities'
import { Evaluator } from '@modules/evaluator/entities'
import { Auditor } from '@modules/auditor/entities'
import { ModelLevel } from '@modules/model/entities'

export class VerifiedCreateEvaluationDto {
  evaluatorLeader: Evaluator
  evaluatorsAdjuncts: Evaluator[]
  evaluatorInstitution: EvaluatorInstitution
  organizationalUnit: OrganizationalUnit
  auditor: Auditor
  expectedModelLevel: ModelLevel
  name: string
  implementationInstitution: string
  start: string
  end: string
}
