import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';
import { Announcement } from '../announcements/entities/announcement.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onApplicationBootstrap() {
    const announcements = await this.announcementRepository.count();
    const categories = await this.categoryRepository.count();

    if (announcements || categories) {
      return;
    }

    const c1 = this.categoryRepository.create({ name: 'Category 1' });
    const c2 = this.categoryRepository.create({ name: 'Category 2' });

    await this.categoryRepository.save([c1, c2]);

    await this.announcementRepository.save([
      {
        title: 'Title 1',
        content: 'Content 1',
        publicationDate: new Date(),
        categories: [c1],
      },
      {
        title: 'Title 2',
        content: 'Content 2',
        publicationDate: new Date(),
        categories: [c2],
      },
    ]);
  }
}
