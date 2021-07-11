import { ModelModule } from '@modules/model'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { database } from './config/env'

@Module({
  imports: [
    MongooseModule.forRoot(database.mongoURI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    }),
    ModelModule
  ]
})
export class AppModule {}
