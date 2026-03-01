import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, In, ILike } from 'typeorm';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { Category } from '../categories/entities/category.entity';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let announcementRepo: jest.Mocked<Repository<Announcement>>;
  let categoryRepo: jest.Mocked<Repository<Category>>;

  const createMockCategory = (id = 1) =>
    ({ id, name: `Category ${id}` }) as Category;

  const createMockAnnouncement = (id = 1) =>
    ({
      id,
      title: 'Title',
      content: 'Content',
      categories: [createMockCategory()],
      publicationDate: new Date(),
    }) as Announcement;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(),
            softRemove: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
    announcementRepo = module.get(getRepositoryToken(Announcement));
    categoryRepo = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const input = {
      title: 'New title',
      content: 'New content',
      categoryIds: [1, 2],
      publicationDate: new Date(),
    };

    it('should successfully create an announcement with categories', async () => {
      const mockCategories = [createMockCategory(1), createMockCategory(2)];
      categoryRepo.findBy.mockResolvedValue(mockCategories);
      announcementRepo.create.mockImplementation((dto) => dto as Announcement);
      announcementRepo.save.mockImplementation(async (entity) =>
        Promise.resolve({ id: 100, ...entity } as Announcement),
      );

      const result = await service.create(input);

      expect(categoryRepo.findBy).toHaveBeenCalledWith({ id: In([1, 2]) });
      expect(announcementRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: input.title,
          categories: mockCategories,
        }),
      );
      expect(result.id).toBe(100);
    });

    it('should throw NotFoundException if any category ID is invalid', async () => {
      categoryRepo.findBy.mockResolvedValue([createMockCategory(1)]);

      await expect(service.create(input)).rejects.toThrow(NotFoundException);
      expect(announcementRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should filter by searchTerm in both title OR content', async () => {
      const filter = { searchTerm: 'ti' };
      announcementRepo.find.mockResolvedValue([]);

      await service.findAll(filter);

      expect(announcementRepo.find).toHaveBeenCalledWith({
        where: [{ title: ILike('%ti%') }, { content: ILike('%ti%') }],
        relations: ['categories'],
      });
    });

    it('should return empty array when no announcements match', async () => {
      announcementRepo.find.mockResolvedValue([]);
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return an announcement', async () => {
      const mockAnnouncement = createMockAnnouncement(1);
      announcementRepo.findOne.mockResolvedValue(mockAnnouncement);

      const result = await service.findOne(1);

      expect(announcementRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });
      expect(result).toEqual(mockAnnouncement);
      expect(result.categories).toBeDefined();
    });

    it('should throw a NotFoundException if the announcement does not exist', async () => {
      announcementRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'Announcement with id 999 not found',
      );
    });
  });

  describe('update', () => {
    const input = { id: 1, title: 'Updated Title', categoryIds: [1] };

    it('should update entity and relations correctly', async () => {
      const existing = createMockAnnouncement(1);
      categoryRepo.findBy.mockResolvedValue([createMockCategory(1)]);
      announcementRepo.preload.mockResolvedValue({
        ...existing,
        ...input,
      } as Announcement);
      announcementRepo.save.mockImplementation(async (entity) =>
        Promise.resolve(entity as Announcement),
      );

      const result = await service.update(1, input);

      expect(announcementRepo.preload).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, title: 'Updated Title' }),
      );
      expect(result.title).toBe('Updated Title');
    });

    it('should throw NotFoundException if announcement does not exist', async () => {
      categoryRepo.findBy.mockResolvedValue([createMockCategory(1)]);
      announcementRepo.preload.mockResolvedValue(undefined);
      await expect(service.update(999, input)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should find and then softRemove the record', async () => {
      const mockEntity = createMockAnnouncement(1);
      announcementRepo.findOne.mockResolvedValue(mockEntity);
      announcementRepo.softRemove.mockResolvedValue(mockEntity);

      const result = await service.remove(1);

      expect(announcementRepo.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['categories'],
      });
      expect(announcementRepo.softRemove).toHaveBeenCalledWith(mockEntity);
      expect(result.id).toBe(1);
    });

    it('should throw NotFoundException if announcement does not exist', async () => {
      announcementRepo.findOne.mockResolvedValue(null);
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
