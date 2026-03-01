import { CreateAnnouncementInput } from './create-announcement.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { IsNumber } from 'class-validator';

@InputType()
export class UpdateAnnouncementInput extends PartialType(
  CreateAnnouncementInput,
) {
  @Field(() => Int)
  @IsNumber()
  id: number;
}
