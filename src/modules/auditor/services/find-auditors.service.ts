import { AuditorDto } from '@modules/shared/dtos/auditor'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Auditor } from '../entities'
import { Repository } from 'typeorm'
import { FindAuditorQueryDto } from '../dtos/find-auditors-query.dto'

@Injectable()
export class FindAuditorsService {
  constructor(@InjectRepository(Auditor) private readonly auditorRepository: Repository<Auditor>) {}
  public async find(findAuditorQueryDto: FindAuditorQueryDto): Promise<AuditorDto[]> {
    const auditors = await this.findAuditorByQuery(findAuditorQueryDto)
    const mappedAuditors = this.mapToDto(auditors)
    return mappedAuditors
  }

  private async findAuditorByQuery(findAuditorQueryDto: FindAuditorQueryDto): Promise<Auditor[]> {
    const queryBuilder = this.auditorRepository
      .createQueryBuilder('auditor')
      .leftJoinAndSelect('auditor.commonEntity', 'commonEntity')

    if (findAuditorQueryDto.name) {
      queryBuilder.andWhere('unaccent(commonEntity.name) ilike unaccent(:name)', {
        name: `%${findAuditorQueryDto.name}%`
      })
    }

    if (findAuditorQueryDto.documentNumber) {
      queryBuilder.andWhere('commonEntity.documentNumber like :documentNumber', {
        documentNumber: `${findAuditorQueryDto.documentNumber}%`
      })
    }

    if (findAuditorQueryDto.status) {
      queryBuilder.andWhere('auditor.status = :status', {
        status: findAuditorQueryDto.status
      })
    }

    const auditor = await queryBuilder.getMany()

    return auditor
  }

  private mapToDto(auditors: Auditor[]): AuditorDto[] {
    return auditors.map(AuditorDto.fromEntity)
  }
}
