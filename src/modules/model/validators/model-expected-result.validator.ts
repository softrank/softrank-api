import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { CreateModelDto } from '../dtos/create-model.dto'
import { CreateModelProcessDto } from '../dtos/create-model-process.dto'

interface CustomValidatorArguments extends ValidationArguments {
  object: CreateModelDto
}

@ValidatorConstraint()
export class ModelExpectedResultValidator implements ValidatorConstraintInterface {
  validate(value: CreateModelProcessDto[], { object }: CustomValidatorArguments): boolean {
    const initialLevels = object.modelLevels.map((modelLevel) => modelLevel.initial.toUpperCase())
    const isValidMinOrMaxLevel = value?.every((modelProcess) => {
      const isValidExpectedResult = modelProcess.expectedResults?.every((expectedResult) => {
        const validMaxLevel = !expectedResult.maxLevel || initialLevels.includes(expectedResult.maxLevel.toUpperCase())
        const validMinLevel = initialLevels.includes(expectedResult.minLevel.toUpperCase())

        return validMaxLevel && validMinLevel
      })
      return isValidExpectedResult
    })
    return isValidMinOrMaxLevel
  }

  defaultMessage(): string {
    return 'Algum nível máximo ou mínimo não existente'
  }
}
