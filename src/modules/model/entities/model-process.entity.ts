import { ExpectedResultEntity } from './expected-result.entity'

export class ModelProcessEntity {
  id: string
  name: string
  initial: string
  description: string
  expectedResults?: ExpectedResultEntity[]
}
