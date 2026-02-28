import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  publicationDate: Date;

  @Field(() => [Int])
  categoryIds: number[];
}
