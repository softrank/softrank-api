import { DeleteEvidenceSourceService } from '../services/evidence'
import { Body, Controller, Delete, Param } from '@nestjs/common'
import { RouteGuards } from '@modules/shared/decorators'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Evidence Source')
@Controller('evidence-source')
export class EvidenceSourceController {
  constructor(private readonly deleteEvidenceSourceService: DeleteEvidenceSourceService) {}

  @Delete(':id')
  @RouteGuards()
  public create(@Param('id', uuidParamValidation()) evidenceSourceId: string): Promise<void> {
    return this.deleteEvidenceSourceService.delete(evidenceSourceId)
  }
}
