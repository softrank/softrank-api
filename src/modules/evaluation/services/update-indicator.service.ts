import { EvaluationIndicatorsFileDto, EvaluationIndicatorsIndicatorDto } from '../dtos/evaluation-indicators'
import { EvaluationProject } from '../entities/evaluation-project.entity'
import { EntityManager, Repository, getConnection } from 'typeorm'
import { IndicatorFile } from '../entities/indicator-files.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { IndicatorNotFoundError } from '../errors'
import { UpdateIndicatorDto } from '../dtos'
import { Injectable } from '@nestjs/common'
import { Indicator } from '../entities'

@Injectable()
export class UpdateIndicatorService {
  constructor(@InjectRepository(Indicator) private readonly indicatorRepository: Repository<Indicator>) {}

  public async update(updateIndicatorDto: UpdateIndicatorDto): Promise<EvaluationIndicatorsIndicatorDto> {
    const indicator = await getConnection().transaction((manager) => {
      return this.updateWithTransaction(updateIndicatorDto, manager)
    })

    return this.buildEvaluationIndicatorsIndicatorDto(indicator)
  }

  public async updateWithTransaction(updateIndicatorDto: UpdateIndicatorDto, manager: EntityManager): Promise<Indicator> {
    const indicator = await this.findIndicatorById(updateIndicatorDto.indicatorId)
    const indicatorToUpdate = await this.updateIndicatorData(updateIndicatorDto, indicator)
    const updatedIndicator = await manager.save(indicatorToUpdate)

    return updatedIndicator
  }

  private async findIndicatorById(indicatorId: string): Promise<Indicator> {
    const indicator = await this.indicatorRepository
      .createQueryBuilder('indicator')
      .leftJoinAndSelect('indicator.projects', 'project')
      .leftJoinAndSelect('indicator.files', 'file')
      .where('indicator.id = :indicatorId')
      .setParameters({ indicatorId })
      .getOne()

    if (!indicator) {
      throw new IndicatorNotFoundError()
    }

    return indicator
  }

  private async updateIndicatorData(updateIndicatorDto: UpdateIndicatorDto, indicator: Indicator): Promise<Indicator> {
    indicator.name = updateIndicatorDto.name
    indicator.qualityAssuranceGroup = updateIndicatorDto.qualityAssuranceGroup

    return indicator
  }

  private buildEvaluationIndicatorsIndicatorDto(indicator: Indicator): EvaluationIndicatorsIndicatorDto {
    const evaluationIndicatorsIndicatorDto = new EvaluationIndicatorsIndicatorDto()

    evaluationIndicatorsIndicatorDto.id = indicator.id
    evaluationIndicatorsIndicatorDto.name = indicator.name
    evaluationIndicatorsIndicatorDto.files = this.buildEvaluationIndicatorsFileDtos(indicator.files)

    return evaluationIndicatorsIndicatorDto
  }

  private buildEvaluationIndicatorsFileDtos(indicatorFiles: IndicatorFile[]): EvaluationIndicatorsFileDto[] {
    return indicatorFiles?.map(this.buildEvaluationIndicatorsFileDto)
  }

  private buildEvaluationIndicatorsFileDto(indicatorFile: IndicatorFile): EvaluationIndicatorsFileDto {
    const evaluationIndicatorsFileDto = new EvaluationIndicatorsFileDto()

    evaluationIndicatorsFileDto.id = indicatorFile.id
    evaluationIndicatorsFileDto.name = indicatorFile.name
    evaluationIndicatorsFileDto.source = indicatorFile.source

    return evaluationIndicatorsFileDto
  }
}
