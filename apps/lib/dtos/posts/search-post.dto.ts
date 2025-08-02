import { IsNotEmpty, IsString } from "class-validator";
import { PaginatedQueryDto } from "../paginated-query.dto";

export class SearchPostsDto extends PaginatedQueryDto {
  @IsString()
  @IsNotEmpty({ message: "search cannot be empty" })
  search: string;
}
