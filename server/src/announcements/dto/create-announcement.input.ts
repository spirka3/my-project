import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsDate,
  ArrayUnique,
  ArrayNotEmpty,
} from 'class-validator';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty({ message: 'Content cannot be empty' })
  content: string;

  @Field(() => Date)
  @IsDate({ message: 'Publication date must be a valid date' })
  publicationDate: Date;

  @Field(() => [Int])
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  categoryIds: number[];
}
