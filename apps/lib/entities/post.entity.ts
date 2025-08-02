import { MediaContent, LikePost } from "../interface";
import { Comment } from "./comment.entity";
import { User } from "./create-user.entity";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn("uuid")
  postId: string;

  @Column()
  title: string;

  @Column({ type: "jsonb" })
  content: MediaContent[];

  @Column({ type: "jsonb", default: [] })
  likes: LikePost[];

  @Column({ nullable: true })
  userId: string;

  @Column({ default: 0 })
  numOfLikes: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "userId" }) // Maps this to the userId column
  user?: User | null;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
