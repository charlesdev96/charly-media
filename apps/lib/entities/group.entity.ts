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
import { User } from "./create-user.entity";
import { GroupChat } from "./group-chat.entity";
import { GroupMember } from "./group-members.entity";

@Entity()
export class Group {
  @PrimaryGeneratedColumn("uuid")
  groupId: string;

  @Column({ nullable: false })
  groupName: string;

  @Column({ nullable: true, default: null })
  groupLogo: string;

  @Column({ nullable: true })
  ownerId: string;

  @Column({ default: 1 })
  numOfMembers: number;

  @ManyToOne(() => User, (user) => user.ownedGroups, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "ownerId" }) // Maps this to the userId column
  owner?: User | null;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.member)
  members: GroupMember[];

  @OneToMany(() => GroupChat, (groupChat) => groupChat.group)
  chats: GroupChat[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
