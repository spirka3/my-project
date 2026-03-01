import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { In, ILike } from 'typeorm';
import { AnnouncementsService } from './announcements.service';
import { Announcement } from './entities/announcement.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;

  const mockCategory = { id: 1, name: 'Category' };
  const mockAnnouncement = {
    id: 1,
    title: 'Title',
    categories: [mockCategory],
    publicationDate: new Date(),
  };

  const mockAnnouncementRepository = {
    find: jest.fn().mockResolvedValue([mockAnnouncement]),
    findOne: jest.fn().mockResolvedValue(mockAnnouncement),
    create: jest.fn().mockImplementation((dto) => ({
      id: 1,
      ...dto,
    })),
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    preload: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({ ...mockAnnouncement, ...dto });
    }),
    remove: jest.fn().mockResolvedValue(mockAnnouncement),
  };

  const mockCategoryRepository = {
    findBy: jest.fn().mockResolvedValue([mockCategory]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsService,
        {
          provide: getRepositoryToken(Announcement),
          useValue: mockAnnouncementRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<AnnouncementsService>(AnnouncementsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new announcement', async () => {
      const input = {
        title: 'New',
        content: 'Content',
        categoryIds: [1],
        publicationDate: new Date(),
      };
      const result = await service.create(input);

      expect(mockAnnouncementRepository.create).toHaveBeenCalled();
      expect(mockAnnouncementRepository.save).toHaveBeenCalled();
      expect(result).toMatchObject({
        title: input.title,
        content: input.content,
        publicationDate: input.publicationDate,
      });
      expect(result.categories).toEqual([mockCategory]);
    });
  });

  describe('findAll', () => {
    it('should return all announcements when no filter is provided', async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockAnnouncement]);
      expect(mockAnnouncementRepository.find).toHaveBeenCalledWith({
        where: {},
        relations: ['categories'],
      });
    });

    it('should apply ILike filter when searchTerm is provided', async () => {
      await service.findAll({ searchTerm: 'test' });
      expect(mockAnnouncementRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            title: ILike('%test%'),
          },
          relations: ['categories'],
        }),
      );
    });

    it('should apply In filter when categoryIds are provided', async () => {
      await service.findAll({ categoryIds: [1] });
      expect(mockAnnouncementRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            categories: { id: In([1]) },
          },
          relations: ['categories'],
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return an announcement if found', async () => {
      const result = await service.findOne(mockAnnouncement.id);
      expect(result).toEqual(mockAnnouncement);
    });

    it('should throw NotFoundException if announcement does not exist', async () => {
      mockAnnouncementRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the announcement', async () => {
      const updatedAnnouncement = {
        ...mockAnnouncement,
        title: 'Updated',
      };
      const result = await service.update(mockAnnouncement.id, {
        ...mockAnnouncement,
        ...updatedAnnouncement,
      });
      expect(mockAnnouncementRepository.preload).toHaveBeenCalled();
      expect(mockAnnouncementRepository.save).toHaveBeenCalled();
      expect(result.id).toEqual(mockAnnouncement.id);
      expect(result.title).toEqual(updatedAnnouncement.title);
    });
  });

  describe('remove', () => {
    it('should remove and return the announcement', async () => {
      const result = await service.remove(mockAnnouncement.id);
      expect(mockAnnouncementRepository.remove).toHaveBeenCalled();
      expect(result).toEqual(mockAnnouncement);
    });
  });
});
