import { Module } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { AnnouncementsResolver } from './announcements.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement])],
  providers: [AnnouncementsResolver, AnnouncementsService],
})
export class AnnouncementsModule {}
