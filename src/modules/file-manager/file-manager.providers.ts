import { FileManagerProvidersEnum } from './enums'
import { Provider } from '@nestjs/common'
import { S3, config } from 'aws-sdk'
import { aws } from '@config/env'

export const fileManagerProviders: Provider[] = [
  {
    provide: FileManagerProvidersEnum.S3,
    useFactory: () => {
      config.update({
        accessKeyId: aws.acessKey,
        secretAccessKey: aws.secretKey,
        region: aws.region
      })

      return new S3()
    }
  }
]
