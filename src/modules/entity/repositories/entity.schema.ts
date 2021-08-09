import { Document, Schema, model, SchemaTypeOptions } from 'mongoose'
import { EntityEntity } from '@modules/entity/entities'
import { DocumentTypeEnum } from '@shared/enums'
import { ObjectId } from 'bson'
import {
  CleanNonNumbers,
  ConvertToObjectId,
  ConvertObjectIdToString
} from '@utils/helpers'

export const EntitySchema: Schema<
  Record<keyof EntityEntity, SchemaTypeOptions<EntityEntity>>
> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    documentType: {
      type: String,
      required: true,
      enum: DocumentTypeEnum
    },
    documentNumber: {
      type: String,
      required: true,
      set: CleanNonNumbers
    },
    phone: {
      type: String,
      required: true,
      set: CleanNonNumbers
    },
    userId: {
      type: ObjectId,
      required: false,
      get: ConvertObjectIdToString,
      set: ConvertToObjectId
    }
  },
  { timestamps: true }
)

export interface EntityDocument extends EntityEntity, Document {
  id: string
}

export const entityMongooseModel = model<EntityDocument>(
  'entities',
  EntitySchema
)
