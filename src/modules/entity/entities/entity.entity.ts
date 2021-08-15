import { DocumentTypeEnum } from '@shared/enums'

export class EntityEntity {
  id: string
  name: string
  email: string
  documentType: DocumentTypeEnum
  documentNumber: string
  phone: string
  userId?: string | any
}
