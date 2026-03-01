import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class AnnouncementsFilterInput {
  @Field(() => [Int], { nullable: true })
  categoryIds?: number[];

  @Field({ nullable: true })
  searchTerm?: string;
}
