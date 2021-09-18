import { connect } from 'mongoose'
import { database } from '../env'

export enum DatabaseProviders {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION'
}

export const databaseProviders = [
  {
    provide: DatabaseProviders.DATABASE_CONNECTION,
    useFactory: async () => {
      return await connect(database.mongoURI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
    }
  }
]
