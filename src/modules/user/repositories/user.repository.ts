import { ConvertToObjectId, NormalizeDocument } from '@utils/helpers'
import { UserProviders } from '@modules/user/user.providers'
import { UserDocument } from '@modules/user/repositories'
import { UserEntity } from '@modules/user/entities'
import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class UserRepository {
  constructor(
    @Inject(UserProviders.USER_MODEL)
    private readonly userModel: Model<UserDocument>
  ) {}

  async create(user: UserEntity): Promise<UserEntity> {
    const document = await this.userModel.create(user)
    return NormalizeDocument(document)
  }

  async findByLogin(login: string): Promise<UserEntity> {
    const document = await this.userModel.findOne({ login })
    return NormalizeDocument(document)
  }

  async findById(id: string): Promise<UserEntity> {
    const document = await this.userModel.findById(ConvertToObjectId(id))
    return NormalizeDocument(document)
  }
}
