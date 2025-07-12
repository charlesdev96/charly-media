import { SetMetadata } from "@nestjs/common";
import { UserRole } from "../../../../lib/enum/user.enum";

export const UserRolesKey = "roles";

export const Roles = (...roles: UserRole[]) => SetMetadata(UserRolesKey, roles);
