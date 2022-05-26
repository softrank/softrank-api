import { DeleteEvidenceSourceService, SetEvidenceSourceFileStatusService } from '../services/evidence'
import { Body, Controller, Delete, Param, Put } from '@nestjs/common'
import { RouteGuards } from '@modules/shared/decorators'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'
import { EvidenceSourceFileDto } from '../dtos/entities'
import { SetEvidenceSourceFileStatusDto } from '../dtos/evidence-source'

@ApiTags('Evidence Source')
@Controller('evidence-source')
export class EvidenceSourceController {
  constructor(
    private readonly deleteEvidenceSourceService: DeleteEvidenceSourceService,
    private readonly setEvidenceSourceFileStatusService: SetEvidenceSourceFileStatusService
  ) {}

  @Delete(':id')
  @RouteGuards()
  public create(@Param('id', uuidParamValidation()) evidenceSourceId: string): Promise<void> {
    return this.deleteEvidenceSourceService.delete(evidenceSourceId)
  }

  @Put('file/:id')
  @RouteGuards()
  public updateEvidenceSourceFileStatus(
    @Param('id', uuidParamValidation()) evidenceSourceFileId: string,
    @Body() { status }: SetEvidenceSourceFileStatusDto
  ): Promise<EvidenceSourceFileDto> {
    const setEvidenceSourceFileStatusDto = new SetEvidenceSourceFileStatusDto(evidenceSourceFileId, status)
    return this.setEvidenceSourceFileStatusService.set(setEvidenceSourceFileStatusDto)
  }
}
