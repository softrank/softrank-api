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
