import { userMongooseModel } from '@modules/user/repositories/user.schema'

export enum UserProviders {
  USER_MODEL = 'USER_MODEL'
}

export const userProviders = [
  {
    provide: UserProviders.USER_MODEL,
    useFactory: () => {
      return userMongooseModel
    }
  }
]
