import { ModelEntity, ModelLevelEntity } from '@modules/model/entities'
import { convertToObjectId, normalizeModel } from '@utils/helpers'
import { ModelProviders } from '@modules/model/model.providers'
import { ModelDocument } from '@modules/model/repositories'
import { ModelNotFoundError } from '@modules/model/errors'
import { Inject, Injectable } from '@nestjs/common'
import { Model } from 'mongoose'

@Injectable()
export class ModelLevelRepository {
  constructor(
    @Inject(ModelProviders.MODEL_MODEL)
    private readonly modelModel: Model<ModelDocument>
  ) {}

  async findById(id: string): Promise<ModelLevelEntity> {
    const document = await this.modelModel.findOne({
      'modelLevels.id': convertToObjectId(id)
    })

    const modelLevel = this.getModelLevel(document, { id })

    return normalizeModel(modelLevel)
  }

  async findByInitial(initial: string): Promise<ModelLevelEntity> {
    const document = await this.modelModel.findOne({
      'modelLevels.initial': initial
    })

    const modelLevel = this.getModelLevel(document, { initial })

    return normalizeModel(modelLevel)
  }

  async checkUpdateName(id: string, name: string): Promise<boolean> {
    const document = await this.modelModel
      .findOne({
        'modelLevels.id': { $ne: convertToObjectId(id) },
        'modelLevels.name': name
      })
      .lean()

    return Boolean(document)
  }

  async update(data: ModelLevelEntity): Promise<ModelLevelEntity> {
    const { id } = data
    const document = await this.modelModel.findOne({
      'modelLevels.id': convertToObjectId(id)
    })

    if (!document) {
      throw new ModelNotFoundError()
    }

    let modelLevel = this.getModelLevel(document, { id })
    modelLevel = data

    await document.save()

    return modelLevel
  }

  private getModelLevel(
    document: ModelEntity,
    param: Partial<ModelLevelEntity>
  ): ModelLevelEntity {
    const [field] = Object.getOwnPropertyNames(param)
    return document.modelLevels?.find(
      (modelLevel) => modelLevel[field] === param[field]
    )
  }
}
