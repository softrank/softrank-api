import {
  CreateOrganizationalUnitService,
  FindOrganizationalUnitByIdService,
  ListOrganizationalUnitService
} from '@modules/organizational-unit/services'
import {
  CreateOrganizationalUnitDto,
  ListOrganizationalUnitQueryDto
} from '@modules/organizational-unit/dtos'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { uuidParamValidation } from '@utils/validations'
import { RouteGuards } from '@modules/shared/decorators'
import { ApiTags } from '@nestjs/swagger'

@Controller('organizational-unit')
@ApiTags('Organizational Unit')
export class OrganizationalUnitController {
  constructor(
    private readonly createOrganizationalUnitService: CreateOrganizationalUnitService,
    private readonly findOrganizationalUnitByIdService: FindOrganizationalUnitByIdService,
    private readonly listOrganizationalUnitService: ListOrganizationalUnitService
  ) {}

  @Post('')
  public createOrganizationalUnit(
    @Body() createOrganizationalUnitBodyDto: CreateOrganizationalUnitDto
  ): Promise<OrganizationalUnitDto> {
    return this.createOrganizationalUnitService.create(createOrganizationalUnitBodyDto)
  }

  @Get(':id')
  public findOrganizationalUnitById(
    @Param('id', uuidParamValidation()) id: string
  ): Promise<OrganizationalUnitDto> {
    return this.findOrganizationalUnitByIdService.find(id)
  }

  @Get()
  @RouteGuards()
  public listOrganizationalUnits(
    @Query() listOrganizationalUnitQueryDto: ListOrganizationalUnitQueryDto
  ): Promise<OrganizationalUnitDto[]> {
    return this.listOrganizationalUnitService.list(listOrganizationalUnitQueryDto)
  }
}
