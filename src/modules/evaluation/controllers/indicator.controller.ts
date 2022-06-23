import {
  CreateEmptyIndicatorService,
  UpdateIndicatorService,
  SetIndicatorStatusService,
  DeleteIndicatorService
} from '@modules/evaluation/services'
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { EvidenceSourceDto } from '@modules/evaluation/dtos/entities'
import { UpdateIndicatorBodyDto, UpdateIndicatorDto } from '@modules/evaluation/dtos'
import { buildImageFileInterceptor } from '@modules/file-manager/decorators'
import { UploadEvidenceSourceService } from '@modules/evaluation/services'
import { AuthorizedUser, RouteGuards, SwaggerUploadFileDecorator } from '@modules/shared/decorators'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { IndicatorDto } from '@modules/evaluation/dtos/entities'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { CreateIndicatorDto, SetIndicatorStatusDto } from '../dtos/indicator'
import { ApiTags } from '@nestjs/swagger'
import { uuidParamValidation } from '@utils/validations'
import { FindIndicatorByIdService } from '../services/indicator'

@ApiTags('Indicator')
@Controller('indicator')
export class IndicatorController {
  constructor(
    private readonly createIndicatorService: CreateEmptyIndicatorService,
    private readonly updateIndicatorService: UpdateIndicatorService,
    private readonly uploadIndicatorFileService: UploadEvidenceSourceService,
    private readonly setIndicatorStatusService: SetIndicatorStatusService,
    private readonly deleteIndicatorService: DeleteIndicatorService,
    private readonly findIndicatorByIdService: FindIndicatorByIdService
  ) {}

  @Post(':targetId')
  @RouteGuards()
  public createIndicator(
    @Param('targetId', uuidParamValidation()) targetId: string,
    @Body() createIndicatorDto: CreateIndicatorDto
  ): Promise<any> {
    return this.createIndicatorService.create(targetId, createIndicatorDto)
  }

  @Post(':indicatorId/file/:projectId')
  @UseInterceptors(buildImageFileInterceptor('file'))
  @SwaggerUploadFileDecorator()
  @RouteGuards()
  public uploadIndicatorFIle(
    @UploadedFile() expressFile: Express.Multer.File,
    @Param('indicatorId', uuidParamValidation()) indicatorId: string,
    @Param('projectId', uuidParamValidation()) projectId: string,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvidenceSourceDto> {
    const uploadIndicatorFileDto = new UploadIndicatorFileDto(indicatorId, projectId, user.id, expressFile)
    return this.uploadIndicatorFileService.upload(uploadIndicatorFileDto)
  }

  @Put(':indicatorId')
  @RouteGuards()
  public updateIndicator(
    @Param('indicatorId', uuidParamValidation()) indicatorId: string,
    @Body() updateIndicatorBodyDto: UpdateIndicatorBodyDto
  ) {
    const updateIndicatorDto = new UpdateIndicatorDto(indicatorId, updateIndicatorBodyDto)
    return this.updateIndicatorService.update(updateIndicatorDto)
  }

  @Put(':indicatorId/status')
  @RouteGuards()
  public setIndicatorStatus(
    @Param('indicatorId', uuidParamValidation()) indicatorId: string,
    @Body() { status }: SetIndicatorStatusDto
  ): Promise<IndicatorDto> {
    const setIndicatorStatusDto = new SetIndicatorStatusDto(indicatorId, status)
    return this.setIndicatorStatusService.setStatus(setIndicatorStatusDto)
  }

  @Delete(':indicatorId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RouteGuards()
  public deleteIndicator(@Param('indicatorId', uuidParamValidation()) indicatorId: string): Promise<void> {
    return this.deleteIndicatorService.delete(indicatorId)
  }

  @Get(':id')
  @RouteGuards()
  public findIndicatorById(@Param('id', uuidParamValidation()) indicatorId: string): Promise<IndicatorDto> {
    return this.findIndicatorByIdService.find(indicatorId)
  }
}
