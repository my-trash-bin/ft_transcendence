import { Controller, Get } from '@nestjs/common';

import { V1Service } from './V1Service';

@Controller()
export class V1Controller {
  constructor(private readonly appService: V1Service) {}

  @Get('/api/v1')
  getHello(): string {
    return this.appService.getHello();
  }
}
