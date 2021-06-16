import { Injectable } from '@nestjs/common'

@Injectable()
export class CreateModelService {
  create(): string {
    return 'Hello World!'
  }
}
