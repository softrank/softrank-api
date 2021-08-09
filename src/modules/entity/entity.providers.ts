import { entityMongooseModel } from '@modules/entity/repositories'

export enum EntityProvidersEnum {
  ENTITY_MODEL = 'ENTITY_MODEL'
}

export const entityProviders = [
  {
    provide: EntityProvidersEnum.ENTITY_MODEL,
    useFactory: () => {
      return entityMongooseModel
    }
  }
]
