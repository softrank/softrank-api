import { DocumentTypeEnum } from '../../enums/document-type.enum'
import { ModelManager } from '../../../model/entities/model-manager.entity'
import { LoginResponseDto } from '@modules/public/dtos'

export class ModelManagerDto {
  id: string
  name: string
  documentNumber: string
  documentType: DocumentTypeEnum
  email: string
  phone: string
  authorization: LoginResponseDto

  static fromEntity(modelManager: ModelManager, authorization?: LoginResponseDto): ModelManagerDto {
    const modelManagerDto = new ModelManagerDto()

    modelManagerDto.id = modelManager.id
    modelManagerDto.name = modelManager.commonEntity.name
    modelManagerDto.documentNumber = modelManager.commonEntity.documentNumber
    modelManagerDto.documentType = modelManager.commonEntity.documentType
    modelManagerDto.email = modelManager.commonEntity.email
    modelManagerDto.phone = modelManager.commonEntity.phone
    modelManagerDto.authorization = authorization

    return modelManagerDto
  }
}
