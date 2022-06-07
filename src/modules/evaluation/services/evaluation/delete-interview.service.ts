import { Interview } from '@modules/evaluation/entities'
import { InterviewNotFoundError } from '@modules/evaluation/errors'
import { EntityManager, getConnection, Repository } from 'typeorm'

export class DeleteInterviewService {
  public async delete(interviewId: string): Promise<void> {
    getConnection().transaction((manager) => {
      return this.deleteWithTransaction(interviewId, manager)
    })
  }

  public async deleteWithTransaction(interviewId: string, manager: EntityManager): Promise<void> {
    await this.softDeleteInterview(interviewId, manager)
  }

  private async softDeleteInterview(interviewId: string, manager: EntityManager): Promise<Interview> {
    const [interview] = await manager.query(
      `
        update
          evaluation.interview
        set
          deleted_at = now()
        where
          id = $1::uuid
        returning
          *
      `,
      [interviewId]
    )

    if (!interview) {
      throw new InterviewNotFoundError()
    }

    return interview
  }
}
