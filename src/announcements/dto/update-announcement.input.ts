import { CreateAnnouncementInput } from './create-announcement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAnnouncementInput extends PartialType(
  CreateAnnouncementInput,
) {
  @Field(() => Int)
  id: number;
}
