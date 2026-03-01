import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AnnouncementsResolver } from './announcements.resolver';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementInput } from './dto/create-announcement.input';

describe('AnnouncementsResolver', () => {
  let resolver: AnnouncementsResolver;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnnouncementsResolver,
        {
          provide: AnnouncementsService,
          useValue: mockService,
        },
      ],
    }).compile();

    resolver = module.get<AnnouncementsResolver>(AnnouncementsResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of announcements', async () => {
      const result = [
        { id: 1, title: 'Title 1' },
        { id: 2, title: 'Title 2' },
      ];
      mockService.findAll.mockReturnValue(result);

      expect(await resolver.findAll()).toEqual(result);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single announcement', async () => {
      const result = { id: 1, title: 'Title' };
      mockService.findOne.mockReturnValue(result);

      expect(await resolver.findOne(1)).toEqual(result);
      expect(mockService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if service fails', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException());

      await expect(resolver.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createAnnouncement', () => {
    it('should call service.create with correct data', async () => {
      const input: CreateAnnouncementInput = {
        title: 'New',
        content: 'Content',
        categoryIds: [1],
        publicationDate: new Date(),
      };
      const created = { id: 1, ...input };
      mockService.create.mockReturnValue(created);

      const result = await resolver.createAnnouncement(input);

      expect(result).toEqual(created);
      expect(mockService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('removeAnnouncement', () => {
    it('should return the removed item', async () => {
      const removed = { id: 1, title: 'Deleted' };
      mockService.remove.mockReturnValue(removed);

      expect(await resolver.removeAnnouncement(1)).toEqual(removed);
      expect(mockService.remove).toHaveBeenCalledWith(1);
    });
  });
});
