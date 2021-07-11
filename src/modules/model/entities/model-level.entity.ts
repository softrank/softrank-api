import { ModelProcessEntity } from './model-process.entity'

export class ModelLevelEntity {
  id: string
  initial: string
  modelProcesses?: ModelProcessEntity[]
}
