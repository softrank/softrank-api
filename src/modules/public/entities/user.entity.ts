import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm'
import { AuditableEntity } from '@modules/shared/entities'
import { UserRole } from './user-role.entity'

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

  @OneToMany(() => UserRole, (userRoles) => userRoles.user)
  @JoinColumn({ name: 'id', referencedColumnName: 'userId' })
  roles: UserRole[]
}
