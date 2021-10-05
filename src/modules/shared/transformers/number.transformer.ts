import { TransformFnParams } from 'class-transformer'
import { cleanNonNumbers } from '@utils/helpers'

interface CustomTransformFnParams extends TransformFnParams {
  value: string
}

export const cleanNonNumberTransformer = ({ value }: CustomTransformFnParams): string => cleanNonNumbers(value)
