import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm'

export class AuditableEntity {
  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @DeleteDateColumn()
  deletedAt: Date
}
