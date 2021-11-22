import {
  CreateOrganizationalUnitService,
  FindOrganizationalUnitByIdService
} from '@modules/organizational-unit/services'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { CreateOrganizationalUnitDto } from '@modules/organizational-unit/dtos'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { uuidParamValidation } from '@utils/validations'
import { ApiTags } from '@nestjs/swagger'

@Controller('organizational-unit')
@ApiTags('Organizational Unit')
export class OrganizationalUnitController {
  constructor(
    private readonly createOrganizationalUnitService: CreateOrganizationalUnitService,
    private readonly findOrganizationalUnitByIdService: FindOrganizationalUnitByIdService
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
}
