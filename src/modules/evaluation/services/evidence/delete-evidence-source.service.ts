import { EvidenceSourceRepository } from '@modules/evaluation/repositories'
import { EvidenceSourceNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection } from 'typeorm'
import { Injectable } from '@nestjs/common'

@Injectable()
export class DeleteEvidenceSourceService {
  constructor(private readonly evidenceSourceRepository: EvidenceSourceRepository) {}

  public async delete(evidenceId: string): Promise<void> {
    await getConnection().transaction(async (manager) => {
      await this.deleteWithTransaction(evidenceId, manager)
    })
  }

  public async deleteWithTransaction(evidenceId: string, manager: EntityManager): Promise<void> {
    await this.verifyIfEvidenceSourceExists(evidenceId)
    await manager.getCustomRepository(EvidenceSourceRepository).softDeleteEvidenceById(evidenceId)
  }

  private async verifyIfEvidenceSourceExists(evidenceSourceId: string): Promise<void> {
    const evidenceSource = await this.evidenceSourceRepository
      .createQueryBuilder('evidenceSource')
      .where('evidenceSource.id = :evidenceSourceId')
      .setParameters({ evidenceSourceId })
      .getOne()

    if (!evidenceSource) {
      throw new EvidenceSourceNotFoundError('Fonte de evidência não encontrada.')
    }
  }
}
