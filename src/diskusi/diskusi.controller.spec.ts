import { Test, TestingModule } from '@nestjs/testing';
import { DiskusiController } from './diskusi.controller';

describe('DiskusiController', () => {
  let controller: DiskusiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiskusiController],
    }).compile();

    controller = module.get<DiskusiController>(DiskusiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
