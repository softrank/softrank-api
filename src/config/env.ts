import * as dotenv from 'dotenv'

dotenv.config()

export const database = {
  mongoURI: process.env.CONNECTION_URI
}

export const api = {
  port: Number(process.env.API_PORT)
}

export const security = {
  expiresIn: process.env.EXPIRES_IN,
  secretKey: process.env.SECRET_KEY
}
