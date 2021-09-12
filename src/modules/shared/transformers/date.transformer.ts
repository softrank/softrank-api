import { TransformFnParams } from 'class-transformer'

export const dateTransformer = ({ value }: TransformFnParams): Date => new Date(value)
