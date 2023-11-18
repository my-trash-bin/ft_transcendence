import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('/api');
  }
}
