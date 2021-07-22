import { Document, Schema, model, SchemaTypeOptions } from 'mongoose'
import { ModelEntity } from '@modules/model/entities'
import { simpleSchema } from '@utils/helpers'
import { ObjectId } from 'bson'

const expectedResultSchema = simpleSchema({
  id: {
    type: ObjectId,
    default: () => new ObjectId(),
    get: (value: ObjectId) => value.toHexString(),
    set: (value: string | ObjectId) => new ObjectId(value)
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  initial: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  minLevel: {
    type: String,
    required: true
  },
  maxLevel: {
    type: String,
    required: true
  }
})

const modelProcessSchema = simpleSchema({
  id: {
    type: ObjectId,
    default: () => new ObjectId(),
    get: (value: ObjectId) => value.toHexString()
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  initial: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  expectedResults: {
    type: [expectedResultSchema]
  }
})

const modelLevelSchema = simpleSchema({
  id: {
    type: ObjectId,
    default: () => new ObjectId(),
    get: (value: ObjectId) => value.toHexString()
  },
  initial: {
    type: String,
    required: true,
    unique: true
  },
  modelProcesses: {
    type: [modelProcessSchema],
    required: false
  }
})

export const modelSchema: Schema<
  Record<keyof ModelEntity, SchemaTypeOptions<ModelEntity>>
> = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    year: {
      type: Date,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    modelLevels: {
      type: [modelLevelSchema],
      required: false
    }
  },
  { timestamps: true }
)

export interface ModelDocument extends ModelEntity, Document {
  id: string
}

export const modelMongooseModel = model<ModelDocument>('models', modelSchema)
