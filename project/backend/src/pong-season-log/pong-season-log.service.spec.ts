import { Test, TestingModule } from '@nestjs/testing';
import { PongSeasonLogService } from './pong-season-log.service';

describe('PongSeasonLogService', () => {
  let service: PongSeasonLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PongSeasonLogService],
    }).compile();

    service = module.get<PongSeasonLogService>(PongSeasonLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
