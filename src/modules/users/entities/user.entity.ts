import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { Follow } from '../../followers/entities/follower.entity';

@Entity('users') // ✅ Table name: 'users'
export class User {
  @PrimaryGeneratedColumn() // ✅ Use UUID for better scalability
  id?: number;

  @Column({ unique: true }) // ✅ Ensure unique email
  email?: string;

  @Column()
  password?: string;

  @Column()
  name?: string;
  
  @Column({ unique: true}) // Ensure uniqueness
  phone?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER }) // ✅ Store roles using enum
  role?: UserRole;

 @OneToMany(() => Follow, (follow) => follow.follower)
  following?: Follow[];
 @OneToMany(() => Follow, (follow) => follow.following)
  followers?: Follow[];

  @CreateDateColumn() // ✅ Auto-generate created timestamp
  createdAt?: Date;

  @UpdateDateColumn() // ✅ Auto-update on changes
  updatedAt?: Date;
}
