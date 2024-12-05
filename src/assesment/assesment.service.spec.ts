import { Test, TestingModule } from '@nestjs/testing';
import { AssesmentService } from './assesment.service';

describe('AssesmentService', () => {
  let service: AssesmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssesmentService],
    }).compile();

    service = module.get<AssesmentService>(AssesmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
