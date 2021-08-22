import { TestDocument } from '@modules/playground/test.schema'
import { Inject, Injectable } from '@nestjs/common'
import { NormalizeDocument } from '@utils/helpers'
import { TestProviders } from './test.provider'
import { Model, ClientSession } from 'mongoose'

@Injectable()
export class TestRepository {
  constructor(
    @Inject(TestProviders.TEST_MODEL)
    private readonly testModel: Model<TestDocument>
  ) {}

  async create(data: any, session: ClientSession): Promise<any> {
    const document = await this.testModel.create([data], { session })
    return NormalizeDocument(document)
  }
}
