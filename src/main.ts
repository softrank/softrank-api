import 'module-alias'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { api } from './config/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.setGlobalPrefix('api')
  app.enableCors()

  const configSwagger = new DocumentBuilder()
    .setTitle('SoftRank Doc')
    .setDescription('Rotas do backend do Softrank')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('SRK')
    .build()

  const document = SwaggerModule.createDocument(app, configSwagger)
  SwaggerModule.setup('api', app, document)

  await app.listen(api.port)
}
bootstrap()
