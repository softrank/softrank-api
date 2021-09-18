import { CreateModelLevelDto } from '@modules/model/dtos'
import { TransformFnParams } from 'class-transformer'

interface CustomTransformFnParams extends TransformFnParams {
  value: CreateModelLevelDto[]
}

export const setPredecessorModelLevelTransformer = ({ value }: CustomTransformFnParams): CreateModelLevelDto[] => {
  if (value?.length) {
    return value.map((modelLevel, index, array) => {
      modelLevel.predecessor = array[index + 1]?.initial

      return modelLevel
    })
  }

  return value
}
