import { convertToObjectId, normalizeModel } from '@utils/helpers'
import { ModelDocument } from '@modules/model/repositories'
import { ModelEntity } from '@modules/model/entities'
import { Inject, Injectable } from '@nestjs/common'
import { ModelProviders } from '@modules/model/model.providers'
import { ModelNotFoundError } from '@modules/model/errors'
import { normalizeModelMapper } from '@utils/helpers'
import { Model } from 'mongoose'

@Injectable()
export class ModelRepository {
  constructor(
    @Inject(ModelProviders.MODEL_MODEL)
    private readonly modelModel: Model<ModelDocument>
  ) {}

  async create(data: any) {
    const document = await this.modelModel.create(data)
    return normalizeModel(document)
  }

  async findById(id: string): Promise<ModelEntity> {
    const document = await this.modelModel.findById(convertToObjectId(id))
    return normalizeModel(document)
  }

  async findByName(name: string): Promise<ModelEntity> {
    const document = await this.modelModel.findOne({ name })
    return normalizeModel(document)
  }

  async listModels(): Promise<ModelEntity[]> {
    const documents = await this.modelModel.find()
    return normalizeModelMapper(documents)
  }

  async checkUpdateName(id: string, name: string): Promise<boolean> {
    const document = await this.modelModel
      .findOne({
        _id: { $ne: convertToObjectId(id) },
        name
      })
      .lean()

    return Boolean(document)
  }

  async update(data: ModelEntity): Promise<any> {
    const { id, ...dataWithoutId } = data
    const document = await this.modelModel.findById(convertToObjectId(data.id))

    if (!document) {
      throw new ModelNotFoundError()
    }

    const newDocument = Object.assign(document, dataWithoutId)
    return await newDocument.save()
  }
}
