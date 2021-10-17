import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { User } from './user.entity'
import { UserRoleEnum } from '@modules/shared/enums'

@Entity({ schema: 'public' })
export class UserRole extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  role: UserRoleEnum

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User
}
