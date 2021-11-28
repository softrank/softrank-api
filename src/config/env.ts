import * as dotenv from 'dotenv'

dotenv.config()

export const database = {
  type: process.env.CONNECTION_TYPE,
  host: process.env.CONNECTION_HOST,
  port: Number(process.env.CONNECTION_PORT),
  username: process.env.CONNECTION_USERNAME,
  password: process.env.CONNECTION_PASSWORD,
  database: process.env.CONNECTION_DATABASE
}

export const testDatabase = {
  type: process.env.CONNECTION_TYPE,
  host: process.env.CONNECTION_HOST,
  port: Number(process.env.CONNECTION_PORT),
  username: process.env.CONNECTION_USERNAME,
  password: process.env.CONNECTION_PASSWORD,
  database: process.env.CONNECTION_E2E_DATABASE
}

export const api = {
  port: Number(process.env.API_PORT),
  secretKey: process.env.SECRET_KEY
}

export const aws = {
  s3: {
    bucket: process.env.AWS_S3_BUCKET,
    baseFolder: process.env.AWS_S3_BASE_FOLDER
  },
  region: process.env.AWS_REGION,
  acessKey: process.env.AWS_ACCESS_KEY_ID,
  secretKey: process.env.AWS_SECRET_ACCESS_KEY
}
