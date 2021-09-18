import { Document, Schema, model, SchemaTypeOptions } from 'mongoose'
import { UserEntity } from '@modules/user/entities'
import { ObjectId } from 'bson'

export const userSchema: Schema<
  Record<keyof UserEntity, SchemaTypeOptions<UserEntity>>
> = new Schema(
  {
    login: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    recoveryToken: {
      type: String,
      required: false
    },
    entityId: {
      type: ObjectId,
      required: true,
      get: (value: ObjectId) => value.toHexString(),
      set: (value: string | ObjectId) => new ObjectId(value)
    }
  },
  { timestamps: true }
)

export interface UserDocument extends UserEntity, Document {
  id: string
}

export const userMongooseModel = model<UserDocument>('users', userSchema)
