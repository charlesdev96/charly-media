import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { User } from "./create-user.entity";
import { Group } from "./group.entity";

@Entity()
export class GroupMember {
  @PrimaryGeneratedColumn("uuid")
  groupMemberId: string;

  @Column({ default: "member" })
  role: "admin" | "member";

  @Column({ nullable: false })
  memberId: string;

  @Column({ default: false })
  creator: boolean;

  @Column()
  groupId: string;

  @ManyToOne(() => Group, (group) => group.members, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "groupId" })
  group: Group;

  @ManyToOne(() => User, (user) => user.groupMemberships, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "memberId" })
  member: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
