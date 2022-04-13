import { DocumentTypeEnum } from '@modules/shared/enums'

export class CreateCommonEntityDto {
  name: string
  phone: string
  email: string
  documentNumber: string
  documentType: DocumentTypeEnum
  password?: string
  userId?: string
}
