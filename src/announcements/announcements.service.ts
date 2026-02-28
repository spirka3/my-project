import { Injectable, NotFoundException } from '@nestjs/common';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class AnnouncementsService {
  private readonly announcements: Announcement[] = [];
  private readonly categories: Category[] = [];

  constructor() {
    const now = new Date();

    const cat1 = {
      id: 1,
      name: 'cat1',
      createdAt: now,
      updatedAt: now,
    };
    const cat2 = {
      id: 2,
      name: 'cat2',
      createdAt: now,
      updatedAt: now,
    };

    this.categories.push(cat1, cat2);

    this.announcements.push(
      {
        id: 1,
        title: 'Title 1',
        content: 'Content 1',
        publicationDate: new Date('2026-03-01T09:00:00.000Z'),
        categories: [cat1],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        title: 'Title 2',
        content: 'Content 2',
        publicationDate: new Date('2026-03-01T10:00:00.000Z'),
        categories: [cat2],
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        title: 'Title 3',
        content: 'Content 3',
        publicationDate: new Date('2026-03-01T11:00:00.000Z'),
        categories: [cat1, cat2],
        createdAt: now,
        updatedAt: now,
      },
    );
  }

  create(createAnnouncementInput: CreateAnnouncementInput): Announcement {
    const now = new Date();

    const categories = this.categories.filter((c) =>
      createAnnouncementInput.categoryIds.includes(c.id),
    );

    const announcement: Announcement = {
      id: 4,
      title: createAnnouncementInput.title,
      content: createAnnouncementInput.content,
      publicationDate: createAnnouncementInput.publicationDate,
      categories: categories,
      createdAt: now,
      updatedAt: now,
    };

    this.announcements.push(announcement);
    return announcement;
  }

  findAll(): Announcement[] {
    return this.announcements;
  }

  findOne(id: number): Announcement {
    const announcement = this.announcements.find((a) => a.id === id);
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return announcement;
  }

  update(
    id: number,
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Announcement {
    const announcement = this.findOne(id);


    if (updateAnnouncementInput.title !== undefined) {
      announcement.title = updateAnnouncementInput.title;
    }
    if (updateAnnouncementInput.content !== undefined) {
      announcement.content = updateAnnouncementInput.content;
    }
    if (updateAnnouncementInput.publicationDate !== undefined) {
      announcement.publicationDate = updateAnnouncementInput.publicationDate;
    }
    if (updateAnnouncementInput.categoryIds !== undefined) {
      announcement.categories = this.categories.filter((c) =>
        (updateAnnouncementInput.categoryIds || []).includes(c.id),
      );
    }

    announcement.updatedAt = new Date();
    return announcement;
  }

  remove(id: number): Announcement {
    const index = this.announcements.findIndex((a) => a.id === id);
    if (index === -1) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

    const [removed] = this.announcements.splice(index, 1);
    return removed;
  }
}
