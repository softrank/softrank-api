import { Body, Controller, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common'
import { CreateIndicatorService, UpdateIndicatorService } from '@modules/evaluation/services'
import { EvaluationIndicatorsFileDto } from '@modules/evaluation/dtos/evaluation-indicators'
import { UpdateIndicatorBodyDto, UpdateIndicatorDto } from '@modules/evaluation/dtos'
import { buildImageFileInterceptor } from '@modules/file-manager/decorators'
import { UploadIndicatorFileService } from '@modules/evaluation/services'
import { AuthorizedUser, RouteGuards, SwaggerUploadFileDecorator } from '@modules/shared/decorators'
import { UploadIndicatorFileDto } from '@modules/evaluation/dtos'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Indicator')
@Controller('indicator')
@RouteGuards()
export class IndicatorController {
  constructor(
    private readonly createIndicatorService: CreateIndicatorService,
    private readonly updateIndicatorService: UpdateIndicatorService,
    private readonly uploadIndicatorFileService: UploadIndicatorFileService
  ) {}

  @Post(':expectedResultId')
  public createIndicator(@Param('expectedResultId') expectedResultId: string): Promise<any> {
    return this.createIndicatorService.create(expectedResultId)
  }

  @Put(':indicatorId')
  public updateIndicator(
    @Param('indicatorId') indicatorId: string,
    @Body() updateIndicatorBodyDto: UpdateIndicatorBodyDto
  ) {
    const updateIndicatorDto = new UpdateIndicatorDto(indicatorId, updateIndicatorBodyDto)
    return this.updateIndicatorService.update(updateIndicatorDto)
  }

  @Post(':indicatorId/file')
  @UseInterceptors(buildImageFileInterceptor('file'))
  @SwaggerUploadFileDecorator()
  public uploadIndicatorFIle(
    @UploadedFile() expressFile: Express.Multer.File,
    @Param('indicatorId') indicatorId: string,
    @AuthorizedUser() user: AuthorizedUserDto
  ): Promise<EvaluationIndicatorsFileDto> {
    const uploadIndicatorFileDto = new UploadIndicatorFileDto(indicatorId, user.id, expressFile)
    return this.uploadIndicatorFileService.upload(uploadIndicatorFileDto)
  }
}
