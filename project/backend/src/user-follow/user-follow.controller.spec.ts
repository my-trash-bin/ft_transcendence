import { Test, TestingModule } from '@nestjs/testing';
import { UserFollowController } from './user-follow.controller';
import { UserFollowService } from './user-follow.service';

describe('UserFollowController', () => {
  let controller: UserFollowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFollowController],
      providers: [UserFollowService],
    }).compile();

    controller = module.get<UserFollowController>(UserFollowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
