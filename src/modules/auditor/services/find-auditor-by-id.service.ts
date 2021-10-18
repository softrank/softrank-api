import { AuditorDto } from '@modules/shared/dtos/auditor'
import { Auditor } from '../entities'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { AuditorNotFoundError } from '../errors/auditor.errors'

export class FindAuditorByIdService {
  constructor(@InjectRepository(Auditor) private readonly auditorRepository: Repository<Auditor>) {}

  public async find(auditorId: string): Promise<AuditorDto> {
    const auditor = await this.findAuditorById(auditorId)
    return AuditorDto.fromEntity(auditor)
  }

  private async findAuditorById(auditorId: string): Promise<Auditor> {
    const auditor = await this.auditorRepository
      .createQueryBuilder('auditor')
      .leftJoinAndSelect('auditor.commonEntity', 'commonEntity')
      .where('auditor.id = :auditorId', { auditorId })
      .getOne()

    if (!auditor) {
      throw new AuditorNotFoundError()
    }

    return auditor
  }
}
