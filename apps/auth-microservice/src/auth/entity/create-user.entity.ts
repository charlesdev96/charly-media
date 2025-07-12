import { IsEmail } from "class-validator";
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserRole } from "../../../../lib/enum/user.enum";

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
