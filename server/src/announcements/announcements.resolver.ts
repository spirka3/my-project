import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';
import { AnnouncementsFilterInput } from './dto/filter.announcement.input';

@Resolver(() => Announcement)
export class AnnouncementsResolver {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Mutation(() => Announcement)
  async createAnnouncement(
    @Args('createAnnouncementInput')
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    return await this.announcementsService.create(createAnnouncementInput);
  }

  @Query(() => [Announcement], { name: 'announcements' })
  async findAll(
    @Args('filter', { nullable: true }) filter?: AnnouncementsFilterInput,
  ): Promise<Announcement[]> {
    return await this.announcementsService.findAll(filter);
  }

  @Query(() => Announcement, { name: 'announcement' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Announcement> {
    return await this.announcementsService.findOne(id);
  }

  @Mutation(() => Announcement)
  async updateAnnouncement(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateAnnouncementInput')
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    return await this.announcementsService.update(id, updateAnnouncementInput);
  }

  @Mutation(() => Announcement)
  async removeAnnouncement(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Announcement> {
    return await this.announcementsService.remove(id);
  }
}
