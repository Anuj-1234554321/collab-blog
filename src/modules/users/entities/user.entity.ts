import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../dto/create-user.dto';

@Entity('users') // ✅ Table name: 'users'
export class User {
  @PrimaryGeneratedColumn() // ✅ Use UUID for better scalability
  id: number;

  @Column({ unique: true }) // ✅ Ensure unique email
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER }) // ✅ Store roles using enum
  role: UserRole;

  @CreateDateColumn() // ✅ Auto-generate created timestamp
  createdAt: Date;

  @UpdateDateColumn() // ✅ Auto-update on changes
  updatedAt: Date;
}
