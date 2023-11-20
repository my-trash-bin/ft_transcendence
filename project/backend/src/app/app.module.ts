import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { PongSeasonLogModule } from '../pong-season-log/pong-season-log.module';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [AuthModule, UsersModule, UserFollowModule, PongSeasonLogModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('/api');
  }
}
