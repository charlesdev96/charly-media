import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./create-user.entity";
import { Group } from "./group.entity";

@Entity()
export class GroupChat {
  @PrimaryGeneratedColumn("uuid")
  groupChatId: string;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentGroupChats, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "senderId" }) // Maps this to the userId column
  sender?: User | null;

  @Column({ nullable: false })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.chats, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "groupId" })
  group: Group;

  @Column({ nullable: false })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
