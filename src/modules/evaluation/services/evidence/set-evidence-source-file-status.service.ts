import { EvidenceSourceFileDto } from '@modules/evaluation/dtos/entities'
import { SetEvidenceSourceFileStatusDto } from '@modules/evaluation/dtos/evidence-source'
import { EvidenceSourceFile } from '@modules/evaluation/entities'
import { EvidenceSourceFileStatusEnum } from '@modules/evaluation/enums'
import { EvidenceSourceFileNotFoundError } from '@modules/evaluation/errors'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, getConnection, Repository } from 'typeorm'

@Injectable()
export class SetEvidenceSourceFileStatusService {
  constructor(@InjectRepository(EvidenceSourceFile) private readonly evidenceSourceFileRepository: Repository<EvidenceSourceFile>) {}
  public async set(setEvidenceSourceFileStatusDto: SetEvidenceSourceFileStatusDto): Promise<EvidenceSourceFileDto> {
    const evidenceSourceFile = await getConnection().transaction((manager) => {
      return this.setWithTransaction(setEvidenceSourceFileStatusDto, manager)
    })

    const evidenceSourceFileDto = EvidenceSourceFileDto.fromEntity(evidenceSourceFile)
    return evidenceSourceFileDto
  }

  public async setWithTransaction(
    setEvidenceSourceFileStatusDto: SetEvidenceSourceFileStatusDto,
    manager: EntityManager
  ): Promise<EvidenceSourceFile> {
    const evidenceSourceFile = await this.findEvidenceSourceFileById(setEvidenceSourceFileStatusDto.evidenceSourceFileId)
    const updatedEvidenceSourceFile = this.updateEvidenceSourceFileStauts(evidenceSourceFile, setEvidenceSourceFileStatusDto.status)
    await manager.save(updatedEvidenceSourceFile)

    return updatedEvidenceSourceFile
  }

  private async findEvidenceSourceFileById(evidenceSourceFileId: string): Promise<EvidenceSourceFile> {
    const evidenceSourceFile = await this.evidenceSourceFileRepository
      .createQueryBuilder('evidenceSourceFile')
      .where('evidenceSourceFile.id = :evidenceSourceFileId')
      .setParameters({ evidenceSourceFileId })
      .getOne()

    if (!evidenceSourceFile) {
      throw new EvidenceSourceFileNotFoundError()
    }

    return evidenceSourceFile
  }

  private updateEvidenceSourceFileStauts(
    evidenceSourceFile: EvidenceSourceFile,
    evidenceSourceFileStatus: EvidenceSourceFileStatusEnum
  ): EvidenceSourceFile {
    evidenceSourceFile.status = evidenceSourceFileStatus
    return evidenceSourceFile
  }
}
