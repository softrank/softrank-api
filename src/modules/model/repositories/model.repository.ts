import { ModelProviders } from '@modules/model/model.providers'
import { ModelDocument } from '@modules/model/repositories'
import { ModelNotFoundError } from '@modules/model/errors'
import { ModelEntity } from '@modules/model/entities'
import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import {
  ConvertToObjectId,
  NormalizeDocument,
  NormalizeDocumentMapper
} from '@utils/helpers'

@Injectable()
export class ModelRepository {
  constructor(
    @Inject(ModelProviders.MODEL_MODEL)
    private readonly modelModel: Model<ModelDocument>
  ) {}

  async create(data: any): Promise<ModelEntity> {
    const document = await this.modelModel.create(data)
    return NormalizeDocument(document)
  }

  async findById(id: string): Promise<ModelEntity> {
    const document = await this.modelModel.findById(ConvertToObjectId(id))
    return NormalizeDocument(document)
  }

  async findByName(name: string): Promise<ModelEntity> {
    const document = await this.modelModel.findOne({ name })
    return NormalizeDocument(document)
  }

  async listModels(): Promise<ModelEntity[]> {
    const documents = await this.modelModel.find()
    return NormalizeDocumentMapper(documents)
  }

  async checkUpdateName(id: string, name: string): Promise<boolean> {
    const document = await this.modelModel
      .findOne({
        _id: { $ne: ConvertToObjectId(id) },
        name
      })
      .lean()

    return Boolean(document)
  }

  async update(data: ModelEntity): Promise<ModelEntity> {
    const { id, ...dataWithoutId } = data
    const document = await this.modelModel.findById(ConvertToObjectId(data.id))

    if (!document) {
      throw new ModelNotFoundError()
    }

    const newDocument = Object.assign(document, dataWithoutId)
    return await newDocument.save()
  }
}
