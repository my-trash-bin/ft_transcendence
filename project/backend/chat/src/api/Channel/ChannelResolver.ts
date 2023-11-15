import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { Exception } from '../../application/exception/Exception';
import { InvalidIdException } from '../../application/exception/InvalidIdException';
import { ChannelService } from '../../application/implementation/Channel/ChannelService';
import { filterInvalidIdException } from '../../util/filterInvalidIdException';
import { idOf } from '../../util/id/idOf';
import { Channel } from './Channel';
import {
  ChannelCreateArgs,
  ChannelUpdateArgs,
  ChannelUpdateStateArgs,
} from './ChannelArgs';
import { ChannelViewModel } from './ChannelViewModel';
import { mapToChannelViewModel } from './mapToChannelViewModel';

@Resolver(() => Channel)
export class ChannelResolver {
  constructor(private readonly channelService: ChannelService) {}

  @Query(() => [ChannelViewModel])
  async channels(
    @Arg('skip') skip?: number,
    @Arg('take') take?: number,
  ): Promise<ChannelViewModel[]> {
    const results = await this.channelService.allChannel(skip, take);
    return results.map(mapToChannelViewModel);
  }

  @Query(() => ChannelViewModel)
  async channel(@Arg('id') channelId: string): Promise<ChannelViewModel> {
    const result = await this.channelService.getMany([idOf(channelId)]);
    const filtered = filterInvalidIdException(result);
    if (filtered.length === 0) {
      throw new InvalidIdException(channelId);
    }
    return mapToChannelViewModel(filtered[0]);
  }

  @Mutation(() => ChannelViewModel)
  async createChannel(
    @Args()
    { title, isPublic, password, maximumMemberCount }: ChannelCreateArgs,
  ): Promise<ChannelViewModel> {
    this.lengthCheck({ password });
    const newChannel = await this.channelService.create({
      title,
      isPublic,
      password,
      maximumMemberCount,
    });

    return mapToChannelViewModel(newChannel);
  }

  @Mutation(() => ChannelViewModel)
  async changeChannelOptions(
    @Args()
    { id, title, isPublic, password, maximumMemberCount }: ChannelUpdateArgs,
  ): Promise<ChannelViewModel> {
    // TODO: 방장만 가능하도록
    this.lengthCheck({ title, password, maximumMemberCount });
    const result = await this.channelService.updateOptions(
      idOf(id),
      title,
      isPublic,
      password,
      maximumMemberCount,
    );
    return mapToChannelViewModel(result);
  }

  @Mutation(() => ChannelViewModel)
  async updateChannelState(
    @Args()
    { id, ownerId, memberCount }: ChannelUpdateStateArgs,
  ): Promise<ChannelViewModel> {
    // TODO: 시스템만 가능토록
    const result = await this.channelService.updateState(
      idOf(id),
      ownerId,
      memberCount,
    );
    return mapToChannelViewModel(result);
  }

  @Mutation(() => ChannelViewModel)
  async deleteChannel(@Arg('id') channelId: string): Promise<ChannelViewModel> {
    // TODO: 시스템만 가능토록
    const result = await this.channelService.delete(idOf(channelId));
    return mapToChannelViewModel(result);
  }

  private lengthCheck({
    title,
    password,
    maximumMemberCount,
  }: {
    title?: string;
    password?: string | null;
    maximumMemberCount?: number;
  }) {
    if (title !== undefined && title.length < 6 && title.length > 20) {
      throw new Exception(
        'Invalid input length',
        `title's length must be 6 between 20`,
      );
    }
    if (
      password !== undefined &&
      password !== null &&
      (password.length < 4 || password.length > 10)
    ) {
      throw new Exception(
        'Invalid input length',
        `password's length must be 4 between 10`,
      );
    }
    if (
      maximumMemberCount !== undefined &&
      (maximumMemberCount < 1 || maximumMemberCount > 20)
    ) {
      throw new Exception(
        'Invalid input length',
        `maximumMemberCount's must be 1 between 20`,
      );
    }
    return true;
  }
}
