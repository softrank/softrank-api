import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'

@Entity({ schema: 'public' })
export class User extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  login: string

  @Column({ type: 'varchar' })
  passwordHash: string

  @Column({ type: 'varchar', nullable: true })
  recoveryToken: string
}
