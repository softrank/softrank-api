import { Readable } from 'stream'

export class ExpressMulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  size: number
  stream: Readable
  destination: string
  filename: string
  path: string
  buffer: Buffer
}
