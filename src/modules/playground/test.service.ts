import { Injectable } from '@nestjs/common'
import { startMongooseSession } from '@utils/helpers'
import { TestRepository } from './test.repository'
import { ClientSession } from 'mongoose'

@Injectable()
export class TestService {
  constructor(private readonly testRepository: TestRepository) {}
  async create(data: any): Promise<any> {
    const session = await startMongooseSession()
    return await this.createWithSession(data, session)
  }

  async createWithSession(data: any, session: ClientSession): Promise<any> {
    console.log(data)

    session.startTransaction()
    await this.testRepository.create(data, session)
    await session.abortTransaction()
    session.endSession()
  }
}
