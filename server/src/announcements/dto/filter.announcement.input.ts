import { InputType, Field, Int } from '@nestjs/graphql';
import { IsArray, IsOptional, IsString } from 'class-validator';

@InputType()
export class AnnouncementsFilterInput {
  @Field(() => [Int], { nullable: true })
  @IsArray()
  @IsOptional()
  categoryIds?: number[];

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  searchTerm?: string;
}
