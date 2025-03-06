import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  follower?: User; // The user who follows

  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  following?: User; // The user being followed
}
