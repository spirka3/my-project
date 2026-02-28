import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateAnnouncementInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  publicationDate: Date;

  @Field(() => [String])
  category: string[];
}
