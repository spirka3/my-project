import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Announcement {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  publicationDate: Date;

  @Field(() => [String])
  category: Array<string>;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
