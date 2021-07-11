import { modelMongooseModel } from './repositories/model.schema'

export enum ModelProviders {
  MODEL_MODEL = 'MODEL_MODEL'
}

export const modelProviders = [
  {
    provide: ModelProviders.MODEL_MODEL,
    useFactory: () => {
      return modelMongooseModel
    }
  }
]
