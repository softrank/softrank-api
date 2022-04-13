import { UserRoleEnum } from '.'

export const UserRolePath = {
  [UserRoleEnum.AUDITOR]: 'auditors/me',
  [UserRoleEnum.EVALUATOR]: 'evaluators/me',
  [UserRoleEnum.EVALUATOR_INSTITUTION]: 'evaluator-institutions/me',
  [UserRoleEnum.MODEL_MANAGER]: 'model-managers/me'
}
