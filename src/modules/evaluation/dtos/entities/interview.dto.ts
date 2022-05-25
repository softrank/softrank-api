import { Interview } from '@modules/evaluation/entities'

export class InterviewDto {
  id: string
  name: string
  source: string

  static fromEntity(interview: Interview): InterviewDto {
    const interviewDto = new InterviewDto()

    interviewDto.id = interview.id
    interviewDto.name = interview.name
    interviewDto.source = interview.source

    return interviewDto
  }

  static fromManyEntities(interviews: Interview[]): InterviewDto[] {
    const interviewsDtos = interviews?.map(InterviewDto.fromEntity)
    return interviewsDtos || []
  }
}
