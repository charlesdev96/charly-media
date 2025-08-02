import { IsNotEmpty, IsString } from "class-validator";
import { PaginatedQueryDto } from "../paginated-query.dto";

export class SearchUsersDto extends PaginatedQueryDto {
  @IsString()
  @IsNotEmpty()
  search: string;
}
