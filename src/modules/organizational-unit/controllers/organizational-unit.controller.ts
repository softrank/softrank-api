import {
  CreateOrganizationalUnitDto,
  CreateOrganizationalUnitBodyDto
} from '@modules/organizational-unit/dtos'
import {
  CreateOrganizationalUnitService,
  FindOrganizationalUnitByIdService
} from '@modules/organizational-unit/services'
import { OrganizationalUnitDto } from '@modules/shared/dtos/organizational-unit'
import { AuthorizedUser, RouteGuards } from '@modules/shared/decorators'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AuthorizedUserDto } from '@modules/shared/dtos/public'
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
  @RouteGuards()
  public createOrganizationalUnit(
    @AuthorizedUser() user: AuthorizedUserDto,
    @Body() createOrganizationalUnitBodyDto: CreateOrganizationalUnitBodyDto
  ): Promise<OrganizationalUnitDto> {
    const createOrganizationalUnitDto = new CreateOrganizationalUnitDto(
      user.id,
      createOrganizationalUnitBodyDto
    )
    return this.createOrganizationalUnitService.create(createOrganizationalUnitDto)
  }

  @Get(':id')
  public findOrganizationalUnitById(
    @Param('id', uuidParamValidation()) id: string
  ): Promise<OrganizationalUnitDto> {
    return this.findOrganizationalUnitByIdService.find(id)
  }
}
