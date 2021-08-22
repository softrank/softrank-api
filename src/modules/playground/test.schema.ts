import { Document, Schema, model, SchemaTypeOptions } from 'mongoose'
import { UserEntity } from '@modules/user/entities'

export const testSchema: Schema<Record<keyof any, SchemaTypeOptions<any>>> =
  new Schema(
    {
      name: {
        type: String,
        required: true
      }
    },
    { timestamps: true }
  )

export interface TestDocument extends UserEntity, Document {
  id: string
}

export const testMongooseModel = model<TestDocument>('tests', testSchema)
