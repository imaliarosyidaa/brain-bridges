import { Test, TestingModule } from '@nestjs/testing';
import { KelasSiswaController } from './kelassiswa.controller';

describe('KelasSiswaController', () => {
  let controller: KelasSiswaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KelasSiswaController],
    }).compile();

    controller = module.get<KelasSiswaController>(KelasSiswaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
