import { Exception } from '../../../exception/Exception';

export class DuplicateNicknameException extends Exception {
  constructor(nickname: string) {
    super(
      'DuplicateNicknameException',
      `Nickname ${nickname} is already in use`,
    );
  }
}
