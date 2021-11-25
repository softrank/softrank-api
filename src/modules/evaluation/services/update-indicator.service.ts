import { OrganizationalUnitProject } from '@modules/organizational-unit/entities'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { EntityManager, Repository, getConnection } from 'typeorm'
import { UpdateIndicatorDto } from '../dtos'
import {
  EvaluationIndicatorsFileDto,
  EvaluationIndicatorsIndicatorDto,
  EvaluationIndicatorsProjectDto
} from '../dtos/evaluation-indicators'
import { Indicator } from '../entities'
import { IndicatorProject } from '../entities/indicator-project.entity'
import { IndicatorFile } from '../entities/indicator-files.entity'
import { IndicatorNotFoundError } from '../errors'
import { OrganizationalUnitProjectNotFoundError } from '@modules/organizational-unit/errors'

@Injectable()
export class UpdateIndicatorService {
  constructor(
    @InjectRepository(Indicator) private readonly indicatorRepository: Repository<Indicator>,
    @InjectRepository(OrganizationalUnitProject)
    private readonly organizationalUnitProjectRepository: Repository<OrganizationalUnitProject>
  ) {}

  public async update(updateIndicatorDto: UpdateIndicatorDto): Promise<EvaluationIndicatorsIndicatorDto> {
    const indicator = await getConnection().transaction((manager) => {
      return this.updateWithTransaction(updateIndicatorDto, manager)
    })

    return this.buildEvaluationIndicatorsIndicatorDto(indicator)
  }

  public async updateWithTransaction(
    updateIndicatorDto: UpdateIndicatorDto,
    manager: EntityManager
  ): Promise<Indicator> {
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

  private async updateIndicatorData(
    updateIndicatorDto: UpdateIndicatorDto,
    indicator: Indicator
  ): Promise<Indicator> {
    indicator.content = updateIndicatorDto.content
    if (updateIndicatorDto.projectIds?.length) {
      indicator.projects = await this.buildIndicatorProjects(updateIndicatorDto.projectIds)
    }

    return indicator
  }

  private async buildIndicatorProjects(projectsIds: string[]): Promise<IndicatorProject[]> {
    const promises = projectsIds?.map((projectId) => {
      return this.buildIndicatorProject(projectId)
    })

    if (promises?.length) {
      return await Promise.all(promises)
    }
  }

  private async buildIndicatorProject(projectId: string): Promise<IndicatorProject> {
    const project = await this.findOrganizationalUnitProjectById(projectId)
    const indicatorProject = new IndicatorProject()

    indicatorProject.project = project

    return indicatorProject
  }

  private async findOrganizationalUnitProjectById(projectId: string): Promise<OrganizationalUnitProject> {
    const project = await this.organizationalUnitProjectRepository
      .createQueryBuilder('project')
      .where('project.id = :projectId')
      .setParameters({ projectId })
      .getOne()

    if (!project) {
      throw new OrganizationalUnitProjectNotFoundError()
    }

    return project
  }

  private buildEvaluationIndicatorsIndicatorDto(indicator: Indicator): EvaluationIndicatorsIndicatorDto {
    const evaluationIndicatorsIndicatorDto = new EvaluationIndicatorsIndicatorDto()

    evaluationIndicatorsIndicatorDto.id = indicator.id
    evaluationIndicatorsIndicatorDto.content = indicator.content
    evaluationIndicatorsIndicatorDto.files = this.buildEvaluationIndicatorsFileDtos(indicator.files)
    evaluationIndicatorsIndicatorDto.projects = this.buildEvaluationIndicatorsProjectDtos(indicator.projects)

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

  private buildEvaluationIndicatorsProjectDtos(
    indicatorProjects: IndicatorProject[]
  ): EvaluationIndicatorsProjectDto[] {
    return indicatorProjects?.map(this.buildEvaluationIndicatorsProjectDto)
  }

  private buildEvaluationIndicatorsProjectDto(
    indicatorProject: IndicatorProject
  ): EvaluationIndicatorsProjectDto {
    const evaluationIndicatorsProjectDto = new EvaluationIndicatorsProjectDto()

    evaluationIndicatorsProjectDto.id = indicatorProject.id
    evaluationIndicatorsProjectDto.projectId = indicatorProject.project.id
    evaluationIndicatorsProjectDto.name = indicatorProject.project.name

    return evaluationIndicatorsProjectDto
  }
}
