import { Schema, Document, startSession, ClientSession } from 'mongoose'
import { ObjectId } from 'bson'

export function simpleSchema<T = any>(
  data: T,
  needTimeStamp: boolean = false
): Schema<T> {
  return new Schema(Object.assign(data, { _id: false, __v: false }), {
    timestamps: needTimeStamp
  })
}

export function ConvertToObjectId(value: ObjectId | string): ObjectId {
  try {
    return new ObjectId(value)
  } catch {
    return null
  }
}

export function ConvertObjectIdToString(value: ObjectId): string {
  return value?.toHexString()
}

export function NormalizeDocument<T = DefaultData>(document: T): T {
  if (!document) {
    return null
  }

  if (document instanceof Document) {
    document = (document as Document).toObject() as T
  }

  const { _id, __v, ...normalizedData } = document as any
  return Object.assign(normalizedData, { id: _id }) as any as T
}

export function NormalizeDocumentMapper(documents: any[]) {
  if (documents && Array.isArray(documents)) {
    return documents.map((document) => NormalizeDocument(document))
  }
  return null
}

type DefaultData = { _id: any; __v: any }

export async function startMongooseSession(): Promise<ClientSession> {
  const session = await startSession()
  return session
}
