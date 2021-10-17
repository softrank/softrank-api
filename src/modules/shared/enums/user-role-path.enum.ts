import { UserRoleEnum } from '.'

export const UserRolePath = {
  [UserRoleEnum.AUDITOR]: 'auditors/me',
  [UserRoleEnum.EVALUATOR]: 'evaluator/me',
  [UserRoleEnum.EVALUATOR_INSTITUTION]: 'evaluator-institution/me',
  [UserRoleEnum.MODEL_MANAGER]: 'model-manager/me'
}
