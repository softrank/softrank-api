import { TransformFnParams } from 'class-transformer'
import { CleanNonNumbers } from '@utils/helpers'

export function CleanNonNumbersTransformer({
  value
}: TransformFnParams): string {
  return CleanNonNumbers(value)
}
