import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { CreateAnnouncementInput } from './dto/create-announcement.input';
import { UpdateAnnouncementInput } from './dto/update-announcement.input';
import { AnnouncementsFilterInput } from './dto/filter.announcement.input';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private readonly announcementRepository: Repository<Announcement>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(
    createAnnouncementInput: CreateAnnouncementInput,
  ): Promise<Announcement> {
    const { categoryIds, ...details } = createAnnouncementInput;

    const categories = await this.categoryRepository.findBy({
      id: In(categoryIds),
    });

    const newAnnouncement = this.announcementRepository.create({
      ...details,
      categories,
    });

    return await this.announcementRepository.save(newAnnouncement);
  }

  async findAll(filter?: AnnouncementsFilterInput): Promise<Announcement[]> {
    const { searchTerm, categoryIds } = filter || {};

    return await this.announcementRepository.find({
      where: {
        ...(searchTerm && { title: ILike(`%${searchTerm}%`) }),
        ...(categoryIds?.length && { categories: { id: In(categoryIds) } }),
      },
      relations: ['categories'],
    });
  }

  async findOne(id: number): Promise<Announcement> {
    const announcement = await this.announcementRepository.findOne({
      where: { id },
      relations: ['categories'],
    });
    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }
    return announcement;
  }

  async update(
    id: number,
    updateAnnouncementInput: UpdateAnnouncementInput,
  ): Promise<Announcement> {
    const categories = updateAnnouncementInput.categoryIds
      ? await this.categoryRepository.findBy({
          id: In(updateAnnouncementInput.categoryIds),
        })
      : [];

    const announcement = await this.announcementRepository.preload({
      ...updateAnnouncementInput,
      categories,
    });

    if (!announcement) {
      throw new NotFoundException(`Announcement with id ${id} not found`);
    }

    return await this.announcementRepository.save(announcement);
  }

  async remove(id: number): Promise<Announcement> {
    const announcement = await this.findOne(id);

    return await this.announcementRepository.remove(announcement);
  }
}
