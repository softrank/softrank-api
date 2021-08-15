import { EntityProvidersEnum } from '@modules/entity/entity.providers'
import { ConvertToObjectId, NormalizeDocument } from '@utils/helpers'
import { EvaluatorNotFoundError } from '@modules/entity/errors'
import { EntityDocument } from '@modules/entity/repositories'
import { EntityEntity } from '@modules/entity/entities'
import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class EntityRepository {
  constructor(
    @Inject(EntityProvidersEnum.ENTITY_MODEL)
    private readonly entityModel: Model<EntityDocument>
  ) {}

  async create(entity: EntityEntity): Promise<EntityEntity> {
    const document = await this.entityModel.create(entity)
    return NormalizeDocument(document)
  }

  async findByDocumentNumber(documentNumber: string): Promise<EntityEntity> {
    const document = await this.entityModel.findOne({ documentNumber })
    return NormalizeDocument(document)
  }

  async findByEmail(email: string): Promise<EntityEntity> {
    const document = await this.entityModel.findOne({ email })
    return NormalizeDocument(document)
  }

  async findById(id: string): Promise<EntityEntity> {
    const document = await this.entityModel.findById(ConvertToObjectId(id))
    return NormalizeDocument(document)
  }

  async findByUserId(userId: string): Promise<EntityEntity> {
    const document = await this.entityModel.findOne({
      userId: ConvertToObjectId(userId)
    })

    return NormalizeDocument(document)
  }

  async setUserId(id: string, userId: string): Promise<void> {
    const document = await this.entityModel.findById(ConvertToObjectId(id))

    if (!document) {
      throw new EvaluatorNotFoundError()
    }

    document.userId = userId
    await document.save()
  }
}
