import { DocumentTypeEnum } from '../../enums/document-type.enum'
import { ModelManager } from '../../../model/entities/model-manager.entity'

export class ModelManagerDto {
  name: string
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string

  static fromEntity(modelManager: ModelManager): ModelManagerDto {
    const modelManagerDto = new ModelManagerDto()

    modelManagerDto.name = modelManager.commonEntity.name
    modelManagerDto.documentNumber = modelManager.commonEntity.documentNumber
    modelManagerDto.documentType = modelManager.commonEntity.documentType
    modelManagerDto.email = modelManager.commonEntity.email
    modelManagerDto.phone = modelManager.commonEntity.phone

    return modelManagerDto
  }
}
