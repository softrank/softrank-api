import { EvidenceSourceDto } from '@modules/evaluation/dtos/entities'
import { SetEvidenceSourceStatusDto } from '@modules/evaluation/dtos/evidence-source'
import { EvidenceSource } from '@modules/evaluation/entities'
import { EvidenceSourceStatusEnum } from '@modules/evaluation/enums'
import { EvidenceSourceNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class SetEvidenceSourceStatusService {
  constructor(
    @InjectRepository(EvidenceSource)
    private readonly evidenceSourceRepository: Repository<EvidenceSource>
  ) {}
  public async set(setEvidenceSourceStatusDto: SetEvidenceSourceStatusDto): Promise<EvidenceSourceDto> {
    const evidenceSource = await getConnection().transaction((manager) => {
      return this.setWithTransaction(setEvidenceSourceStatusDto, manager)
    })

    const evidenceSourceDto = EvidenceSourceDto.fromEntity(evidenceSource)
    return evidenceSourceDto
  }

  public async setWithTransaction(setEvidenceSourceStatusDto: SetEvidenceSourceStatusDto, manager: EntityManager): Promise<EvidenceSource> {
    const evidenceSource = await this.findEvidenceSourceById(setEvidenceSourceStatusDto.evidenceSourceId)
    const updatedEvidenceSource = this.updateEvidenceSourceStauts(evidenceSource, setEvidenceSourceStatusDto.status)
    await manager.save(updatedEvidenceSource)

    return updatedEvidenceSource
  }

  private async findEvidenceSourceById(evidenceSourceId: string): Promise<EvidenceSource> {
    const evidenceSource = await this.evidenceSourceRepository
      .createQueryBuilder('evidenceSource')
      .where('evidenceSource.id = :evidenceSourceId')
      .setParameters({ evidenceSourceId })
      .getOne()

    if (!evidenceSource) {
      throw new EvidenceSourceNotFoundError('Fonde de evidência não encontrada.')
    }

    return evidenceSource
  }

  private updateEvidenceSourceStauts(evidenceSource: EvidenceSource, evidenceSourceStatus: EvidenceSourceStatusEnum): EvidenceSource {
    evidenceSource.status = evidenceSourceStatus
    return evidenceSource
  }
}
