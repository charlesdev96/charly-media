import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

// Define the structure of each content item
export class MediaContent {
  @IsString({ message: "mediaUrl must be a string" })
  @IsNotEmpty({ message: "mediaUrl is required" })
  @IsUrl()
  mediaUrl: string;

  @IsString({ message: "cloudinaryId must be a string" })
  @IsNotEmpty({ message: "cloudinaryId is required" })
  cloudinaryId: string;
}

export class CreatePostDto {
  @IsNotEmpty({ message: "Title is required" })
  @IsString({ message: "Title must be a string" })
  title: string;

  @IsArray({ message: "content must be an array" })
  @ValidateNested({ each: true })
  @ArrayNotEmpty({ message: "content must not be empty" })
  @Type(() => MediaContent)
  content: MediaContent[];
}

export class UpdatePostDto {
  @IsOptional()
  @IsNotEmpty({ message: "Title is required" })
  @IsString({ message: "Title must be a string" })
  title?: string;

  @IsOptional()
  @IsArray({ message: "content must be an array" })
  @ValidateNested({ each: true })
  @Type(() => MediaContent)
  @ArrayNotEmpty({ message: "content must not be empty" })
  content?: MediaContent[];
}
