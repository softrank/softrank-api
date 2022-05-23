export enum EvaluationStateEnum {
  PENDING = 'pending',
  REFUSED = 'refused',
  INITIAL_EVALUATION = 'inital evaluation',
  FINAL_EVALUATION = 'final evaluation',
  AUDITORING = 'auditoring',
  FINISHED = 'finished'
}

export enum TranslatedEvaluationStateEnum {
  WAITING_APROOVE = 'Aguardando aprovação',
  INITIAL_EVALUATION = 'Avaliação inicial',
  FINAL_EVALUATION = 'Avaliação final',
  AUDITORING = 'Em auditoria',
  FINISHED = 'Concluído',
  REFUSED = 'Avaliação negada'
}

export const evaluationStateMapper: Record<EvaluationStateEnum, TranslatedEvaluationStateEnum> = {
  [EvaluationStateEnum.PENDING]: TranslatedEvaluationStateEnum.WAITING_APROOVE,
  [EvaluationStateEnum.INITIAL_EVALUATION]: TranslatedEvaluationStateEnum.INITIAL_EVALUATION,
  [EvaluationStateEnum.FINAL_EVALUATION]: TranslatedEvaluationStateEnum.FINAL_EVALUATION,
  [EvaluationStateEnum.AUDITORING]: TranslatedEvaluationStateEnum.AUDITORING,
  [EvaluationStateEnum.FINISHED]: TranslatedEvaluationStateEnum.FINISHED,
  [EvaluationStateEnum.REFUSED]: TranslatedEvaluationStateEnum.REFUSED
}
