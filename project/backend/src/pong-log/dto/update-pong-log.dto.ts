import { PartialType } from '@nestjs/swagger';
import { CreatePongSeasonLogDto } from './create-pong-log.dto';

export class UpdatePongSeasonLogDto extends PartialType(
  CreatePongSeasonLogDto,
) {}
