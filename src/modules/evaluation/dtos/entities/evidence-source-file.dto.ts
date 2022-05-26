import { EvidenceSourceFileStatusEnum } from '@modules/evaluation/enums'
import { EvidenceSourceFile } from '@modules/evaluation/entities'

export class EvidenceSourceFileDto {
  id: string
  name: string
  source: string
  status: EvidenceSourceFileStatusEnum

  static fromEntity(evidenceSourceFile: EvidenceSourceFile): EvidenceSourceFileDto {
    const evidenceSourceFileDto = new EvidenceSourceFileDto()

    evidenceSourceFileDto.id = evidenceSourceFile.id
    evidenceSourceFileDto.name = evidenceSourceFile.name
    evidenceSourceFileDto.source = evidenceSourceFile.source
    evidenceSourceFileDto.status = evidenceSourceFile.status

    return evidenceSourceFileDto
  }

  static fromManyEntities(evidenceSourceFiles: EvidenceSourceFile[]): EvidenceSourceFileDto[] {
    const evidenceSourceFilesDtos = evidenceSourceFiles?.map(EvidenceSourceFileDto.fromEntity)
    return evidenceSourceFilesDtos || []
  }
}
