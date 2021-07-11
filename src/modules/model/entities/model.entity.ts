import { ModelLevelEntity } from './model-level.entity'
export class ModelEntity {
  id: string
  name: string
  year: Date
  description: string
  modelLevels?: ModelLevelEntity[]
}
