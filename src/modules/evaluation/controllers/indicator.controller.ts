import { CreateEmptyIndicatorService, UpdateIndicatorService, SetIndicatorStatusService } from '@modules/evaluation/services'
import { Body, Controller, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { EvaluationIndicatorsFileDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { UpdateIndicatorBodyDto, UpdateIndicatorDto } from '@modules/evaluation/dtos'
import { buildImageFileInterceptor } from '@modules/file-manager/decorators'
import { UploadIndicatorFileService } from '@modules/evaluation/services'
import { AuthorizedUser, RouteGuards, SwaggerUploadFileDecorator } from '@modules/shared/decorators'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { IndicatorDto } from '@modules/evaluation/dtos/entities'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { SetIndicatorStatusDto } from '../dtos/indicator'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Indicator')
@Controller('indicator')
@RouteGuards()
export class IndicatorController {
  constructor(
    private readonly createIndicatorService: CreateEmptyIndicatorService,
    private readonly updateIndicatorService: UpdateIndicatorService,
    private readonly uploadIndicatorFileService: UploadIndicatorFileService,
    private readonly setIndicatorStatusService: SetIndicatorStatusService
  ) {}

  @Post(':expectedResultId')
  public createIndicator(@Param('expectedResultId') expectedResultId: string): Promise<any> {
    return this.createIndicatorService.create(expectedResultId)
  }

  @Put(':indicatorId')
  public updateIndicator(@Param('indicatorId') indicatorId: string, @Body() updateIndicatorBodyDto: UpdateIndicatorBodyDto) {
    const updateIndicatorDto = new UpdateIndicatorDto(indicatorId, updateIndicatorBodyDto)
    return this.updateIndicatorService.update(updateIndicatorDto)
  }

  @Put(':indicatorId/status')
  public setIndicatorStatus(@Param('indicatorId') indicatorId: string, @Body() { status }: SetIndicatorStatusDto): Promise<IndicatorDto> {
    const setIndicatorStatusDto = new SetIndicatorStatusDto(indicatorId, status)
    return this.setIndicatorStatusService.setStatus(setIndicatorStatusDto)
  }

  @Post(':indicatorId/file/:projectId')
  @UseInterceptors(buildImageFileInterceptor('file'))
  @SwaggerUploadFileDecorator()
  public uploadIndicatorFIle(
    @UploadedFile() expressFile: Express.Multer.File,
    @Param('indicatorId') indicatorId: string,
    @Param('projectId') projectId: string,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvaluationIndicatorsFileDto> {
    const uploadIndicatorFileDto = new UploadIndicatorFileDto(indicatorId, projectId, user.id, expressFile)
    return this.uploadIndicatorFileService.upload(uploadIndicatorFileDto)
  }
}
