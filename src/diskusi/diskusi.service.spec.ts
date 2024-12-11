import { Test, TestingModule } from '@nestjs/testing';
import { DiskusiService } from './diskusi.service';

describe('DiskusiService', () => {
  let service: DiskusiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiskusiService],
    }).compile();

    service = module.get<DiskusiService>(DiskusiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
