import { testMongooseModel } from '@modules/playground/test.schema'

export enum TestProviders {
  TEST_MODEL = 'TEST_MODEL'
}

export const testProviders = [
  {
    provide: TestProviders.TEST_MODEL,
    useFactory: () => {
      return testMongooseModel
    }
  }
]
