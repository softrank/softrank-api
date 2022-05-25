import { ExpressMulterFile } from '@modules/file-manager/interfaces'

export class UploadEvaluationPlanDto extends ExpressMulterFile {
  constructor(expressMulterFile: ExpressMulterFile, evaluationId: string) {
    super()
    Object.assign(this, expressMulterFile, { evaluationId })
  }

  evaluationId: string
}
