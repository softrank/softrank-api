import { Document, Schema, model, SchemaTypeOptions } from 'mongoose'
import { ModelEntity } from '@modules/model/entities'
import { simpleSchema } from '@utils/helpers'
import { ObjectId } from 'bson'

const expectedResultSchema = simpleSchema(
  {
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
    minLevel: {
      type: String,
      required: true
    },
    maxLevel: {
      type: String,
      required: true
    }
  },
  true
)

const modelProcessSchema = simpleSchema(
  {
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
  },
  true
)

const modelLevelSchema = simpleSchema(
  {
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
      type: [modelProcessSchema]
    }
  },
  true
)

export const modelSchema: Schema<
  Record<keyof ModelEntity, SchemaTypeOptions<ModelEntity>>
> = new Schema(
  {
    id: {
      type: String,
      required: true
    },
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
      type: [modelLevelSchema]
    }
  },
  { timestamps: true }
)

export interface ModelDocument extends ModelEntity, Document {
  id: string
}

export const modelMongooseModel = model<ModelDocument>('models', modelSchema)
