import { UserFriendlyException } from '../../../exception/UserFriendlyException';

export class DuplicateNicknameException extends UserFriendlyException<'DUPLICATE_NICKNAME'> {
  constructor(nickname: string) {
    super(
      'DuplicateNicknameException',
      `Nickname ${nickname} is already in use`,
      'DUPLICATE_NICKNAME',
      { nickname },
    );
  }
}
