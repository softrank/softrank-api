import { EvidenceSourceFile } from '@modules/evaluation/entities'

export class EvidenceSourceFileDto {
  id: string
  name: string
  source: string

  static fromEntity(evidenceSourceFile: EvidenceSourceFile): EvidenceSourceFileDto {
    const evidenceSourceFileDto = new EvidenceSourceFileDto()

    evidenceSourceFileDto.id = evidenceSourceFile.id
    evidenceSourceFileDto.name = evidenceSourceFile.name
    evidenceSourceFileDto.source = evidenceSourceFile.source

    return evidenceSourceFileDto
  }

  static fromManyEntities(evidenceSourceFiles: EvidenceSourceFile[]): EvidenceSourceFileDto[] {
    const evidenceSourceFilesDtos = evidenceSourceFiles?.map(EvidenceSourceFileDto.fromEntity)
    return evidenceSourceFilesDtos || []
  }
}
