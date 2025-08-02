import { IsEmail } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../enum/user.enum";
import { Post } from "./post.entity";
import { Comment } from "./comment.entity";
import { Chat } from "./chat.entity";
import { Group } from "./group.entity";
import { GroupChat } from "./group-chat.entity";
import { GroupMember } from "./group-members.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: "enum", enum: UserRole, default: UserRole.User })
  role: UserRole;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Chat, (chat) => chat.sender)
  sentChats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.receiver)
  receivedChats: Chat[];

  @OneToMany(() => Group, (group) => group.owner)
  ownedGroups: Group[];

  @OneToMany(() => GroupChat, (groupChat) => groupChat.sender)
  sentGroupChats: GroupChat[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.member)
  groupMemberships: GroupMember[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
