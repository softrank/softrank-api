import { ModelEntity } from '@modules/model/entities'
import { simpleSchema } from '@utils/helpers'
import { Document, Schema, model } from 'mongoose'
import { v4 } from 'uuid'

const expectedResultSchema = simpleSchema(
  {
    id: {
      type: String,
      default: v4()
    },
    name: {
      type: String,
      required: true
    },
    initial: {
      type: String,
      required: true
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
      type: String,
      default: v4()
    },
    name: {
      type: String,
      required: true
    },
    initials: {
      type: String,
      required: true
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
      type: String,
      default: v4()
    },
    initial: {
      type: String,
      required: true
    },
    modelProcesses: {
      type: [modelProcessSchema]
    }
  },
  true
)

export const modelSchema: Schema<Record<keyof ModelEntity, any>> = new Schema(
  {
    id: {
      type: String
    },
    name: {
      type: String,
      required: true
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
