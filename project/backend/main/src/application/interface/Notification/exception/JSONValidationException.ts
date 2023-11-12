import { Exception } from '../../../exception/Exception';

export enum JSONValidationErrorCodes {
  InvalidFormat = 'INVALID_JSON_FORMAT',
  InvalidStructure = 'INVALID_JSON_STRUCTURE',
}

export class JSONValidationException extends Exception {
  constructor(code: JSONValidationErrorCodes) {
    const messageMap = {
      [JSONValidationErrorCodes.InvalidFormat]:
        'The provided JSON is not in a valid format.',
      [JSONValidationErrorCodes.InvalidStructure]:
        'The provided JSON does not match the required structure.',
    };

    super('JSONValidationException', messageMap[code] || 'Invalid JSON');
  }
}
