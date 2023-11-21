import { Test, TestingModule } from '@nestjs/testing';
import { PongSeasonLogController } from './pong-season-log.controller';
import { PongSeasonLogService } from './pong-season-log.service';

describe('PongSeasonLogController', () => {
  let controller: PongSeasonLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PongSeasonLogController],
      providers: [PongSeasonLogService],
    }).compile();

    controller = module.get<PongSeasonLogController>(PongSeasonLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
