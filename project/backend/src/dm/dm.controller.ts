import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DmService } from './dm.service';

@ApiTags('dm')
@Controller('/api/v1/dm')
export class DmController {
  constructor(private readonly dmService: DmService) {}
}
