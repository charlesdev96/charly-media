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

@Entity()
export class Chat {
  @PrimaryGeneratedColumn("uuid")
  chatId: string;

  @Column({ nullable: true })
  senderId: string;

  @ManyToOne(() => User, (user) => user.sentChats, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "senderId" }) // Maps this to the userId column
  sender?: User;

  @Column({ nullable: true })
  receiverId: string;

  @ManyToOne(() => User, (user) => user.receivedChats, {
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "receiverId" }) // Maps this to the userId column
  receiver?: User;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
