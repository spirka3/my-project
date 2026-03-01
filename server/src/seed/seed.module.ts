import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Announcement } from '../announcements/entities/announcement.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Announcement, Category])],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
