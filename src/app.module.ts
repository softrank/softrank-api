import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import { ModelModule } from '@modules/model'
import { Module } from '@nestjs/common'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => await getConnectionOptions()
    }),
    ModelModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
