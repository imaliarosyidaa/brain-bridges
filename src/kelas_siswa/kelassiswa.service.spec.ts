import { Test, TestingModule } from '@nestjs/testing';
import { KelasSiswaService } from './kelassiswa.service';

describe('KelasSiswaService', () => {
  let service: KelasSiswaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KelasSiswaService],
    }).compile();

    service = module.get<KelasSiswaService>(KelasSiswaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
