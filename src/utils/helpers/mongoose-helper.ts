import { Schema, Document } from 'mongoose'
import { ObjectId } from 'bson'

export function simpleSchema<T = any>(
  data: T,
  needTimeStamp: boolean = false
): Schema<T> {
  return new Schema(Object.assign(data, { _id: false, __v: false }), {
    timestamps: needTimeStamp
  })
}

export function convertToObjectId(value: any): ObjectId {
  try {
    return new ObjectId(value)
  } catch {
    return null
  }
}

export function normalizeModel<T = DefaultData>(model: T): T {
  if (!model) {
    return null
  }

  if (model instanceof Document) {
    model = (model as Document).toObject() as T
  }

  const { _id, __v, ...normalizedData } = model as any
  return Object.assign(normalizedData, { id: _id }) as any as T
}

export function normalizeModelMapper(models: any[]) {
  if (models && Array.isArray(models)) {
    return models.map((model) => normalizeModel(model))
  }
  return null
}

type DefaultData = { _id: any; __v: any }
