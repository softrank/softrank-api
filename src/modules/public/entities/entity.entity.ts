import { Column, PrimaryGeneratedColumn, Entity as OrmEntity, OneToOne, JoinColumn } from 'typeorm'
import { DocumentTypeEnum } from '@modules/shared/enums'
import { cleanNonNumbers } from '@utils/helpers'
import { User } from '@modules/public/entities'

@OrmEntity({ schema: 'public' })
export class CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('varchar')
  name: string

  @Column('char')
  documentType: DocumentTypeEnum

  @Column({
    type: 'varchar',
    transformer: {
      from: (value: string): string => value,
      to: cleanNonNumbers
    }
  })
  documentNumber: string

  @Column('varchar')
  email: string

  @Column({
    type: 'varchar',
    transformer: {
      from: (value: string): string => value,
      to: cleanNonNumbers
    }
  })
  phone: string

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User
}
