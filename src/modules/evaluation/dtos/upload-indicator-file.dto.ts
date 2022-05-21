import { ExpressMulterFile } from '../../file-manager/interfaces/express-multer-file'

export class UploadIndicatorFileDto extends ExpressMulterFile {
  constructor(indicatorId: string, projectId: string, userId: string, expressMulterFile: ExpressMulterFile) {
    super()

    this.indicatorId = indicatorId
    this.projectId = projectId
    this.userId = userId
    this.buffer = expressMulterFile.buffer
    this.destination = expressMulterFile.destination
    this.encoding = expressMulterFile.encoding
    this.fieldname = expressMulterFile.fieldname
    this.filename = expressMulterFile.filename
    this.mimetype = expressMulterFile.mimetype
    this.originalname = expressMulterFile.originalname
    this.path = expressMulterFile.path
    this.size = expressMulterFile.size
    this.stream = expressMulterFile.stream
  }

  indicatorId: string
  projectId: string
  userId: string
}
