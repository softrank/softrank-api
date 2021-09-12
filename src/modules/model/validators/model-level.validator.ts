import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'
import { CreateModelLevelDto } from '../dtos/create-model-level.dto'

@ValidatorConstraint()
export class ModelLevelValidator implements ValidatorConstraintInterface {
  private errorMessage: string
  private hasDuplicatedPredecessor = false
  private hasDuplicatedModelLevelName = false

  private setInvalidPredecessorErrorMessage(initialModelLevel: string): void {
    this.errorMessage = `Antecessor do nível ${initialModelLevel} inválido.`
  }

  private setSameLevelErrorMessage(initialModelLevel: string): void {
    this.errorMessage = `Nível ${initialModelLevel} não pode ser antecessor dele mesmo.`
  }

  private setDuplicatedPredecessorErrorMessage(predecessor: string): void {
    this.errorMessage = `Antecessor ${predecessor} duplicado.`
  }

  private setDuplicatedNameErrorMessage(name: string): void {
    this.errorMessage = `Nome ${name} duplicado.`
  }

  validate(value: CreateModelLevelDto[]): boolean {
    const modelLevelsInitial = value.map((modelLevel) => modelLevel.initial)
    const hasInvalidPredecessor = value.every((modelLevel) => {
      const isValidPredecessor = !modelLevel.predecessor || modelLevelsInitial.includes(modelLevel.predecessor)

      const isSameLevel = modelLevel.predecessor === modelLevel.initial

      if (!isValidPredecessor) {
        this.setInvalidPredecessorErrorMessage(modelLevel.initial)
      }

      if (isSameLevel) {
        this.setSameLevelErrorMessage(modelLevel.initial)
      }
      return isValidPredecessor && !isSameLevel
    })

    const predecessorCounter = value.reduce((accumulator, modelLevel): { [x: string]: number } => {
      if (accumulator[modelLevel.predecessor]) {
        accumulator[modelLevel.predecessor] += 1
      } else {
        accumulator[modelLevel.predecessor] = 1
      }
      return accumulator
    }, {})

    const nameCounter = value.reduce((accumulator, modelLevel): { [x: string]: number } => {
      if (accumulator[modelLevel.name]) {
        accumulator[modelLevel.name] += 1
      } else {
        accumulator[modelLevel.name] = 1
      }
      return accumulator
    }, {})

    for (const field in nameCounter) {
      const isDuplicated = nameCounter[field] > 1
      if (isDuplicated) {
        this.setDuplicatedNameErrorMessage(field)
        this.hasDuplicatedModelLevelName = true
      }
    }

    for (const field in predecessorCounter) {
      const isDuplicated = predecessorCounter[field] > 1
      if (isDuplicated) {
        this.setDuplicatedPredecessorErrorMessage(field)
        this.hasDuplicatedPredecessor = true
      }
    }

    return hasInvalidPredecessor && !this.hasDuplicatedPredecessor && !this.hasDuplicatedModelLevelName
  }

  defaultMessage(): string {
    return this.errorMessage
  }
}
