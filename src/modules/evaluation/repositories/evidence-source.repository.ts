import { EntityRepository, Repository } from 'typeorm'
import { EvidenceSource } from '../entities'

@EntityRepository(EvidenceSource)
export class EvidenceSourceRepository extends Repository<EvidenceSource> {
  public async softDeleteEvidenceById(evidenceSourceId: string): Promise<void> {
    await this.query(
      `
      update evaluation.evidence_source
      set
        "deletedAt" = now()
      where
        id = $1::uuid
    `,
      [evidenceSourceId]
    )

    await this.softDeleteEvidenceFileById(evidenceSourceId)
  }

  public async softDeleteEvidenceFileById(evidenceSourceId: string): Promise<void> {
    await this.query(
      `
      update evaluation.evidence_source_file
      set
        "deletedAt" = now()
      where
        "evidenceSourceId" = $1::uuid
    `,
      [evidenceSourceId]
    )
  }
}
