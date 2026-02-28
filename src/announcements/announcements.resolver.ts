import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';

@Resolver(() => Announcement)
export class AnnouncementsResolver {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Mutation(() => Announcement)
  createAnnouncement(
    @Args('createAnnouncementInput')
    createAnnouncementInput: CreateAnnouncementInput,
  ): Announcement {
    return this.announcementsService.create(createAnnouncementInput);
  }

  @Query(() => [Announcement], { name: 'announcements' })
  findAll(): Announcement[] {
    return this.announcementsService.findAll();
  }

  @Query(() => Announcement, { name: 'announcement' })
  findOne(@Args('id', { type: () => Int }) id: number): Announcement {
    return this.announcementsService.findOne(id);
  }

  @Mutation(() => Announcement)
  updateAnnouncement(
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Announcement {
    return this.announcementsService.update(
      updateAnnouncementInput.id,
      updateAnnouncementInput,
    );
  }

  @Mutation(() => Announcement)
  removeAnnouncement(
    @Args('id', { type: () => Int }) id: number,
  ): Announcement {
    return this.announcementsService.remove(id);
  }
}
