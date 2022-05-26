import { DeleteEvidenceSourceService, SetEvidenceSourceStatusService } from '../services/evidence'
import { Body, Controller, Delete, Param, Put } from '@nestjs/common'
import { RouteGuards } from '@modules/shared/decorators'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'
import { EvidenceSourceDto } from '../dtos/entities'
import { SetEvidenceSourceStatusDto } from '../dtos/evidence-source'

@ApiTags('Evidence Source')
@Controller('evidence-source')
export class EvidenceSourceController {
  constructor(
    private readonly deleteEvidenceSourceService: DeleteEvidenceSourceService,
    private readonly setEvidenceSourceStatusService: SetEvidenceSourceStatusService
  ) {}

  @Delete(':id')
  @RouteGuards()
  public create(@Param('id', uuidParamValidation()) evidenceSourceId: string): Promise<void> {
    return this.deleteEvidenceSourceService.delete(evidenceSourceId)
  }

  @Put(':id')
  @RouteGuards()
  public updateEvidenceSourceStatus(
    @Param('id', uuidParamValidation()) evidenceSourceId: string,
    @Body() { status }: SetEvidenceSourceStatusDto
  ): Promise<EvidenceSourceDto> {
    const setEvidenceSourceStatusDto = new SetEvidenceSourceStatusDto(evidenceSourceId, status)
    return this.setEvidenceSourceStatusService.set(setEvidenceSourceStatusDto)
  }
}
