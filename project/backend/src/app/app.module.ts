import { CookieParserMiddleware } from '@nest-middlewares/cookie-parser';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { JwtModule } from '@nestjs/jwt';
import { AchievementModule } from '../achievement/achievement.module';

import { AuthModule } from '../auth/auth.module';
import { AvatarModule } from '../avatar/avatar.module';
import { ChannelModule } from '../channel/channel.module';
import { EventsModule } from '../events/events.module';
import { PongLogModule } from '../pong-log/pong-log.module';
import { UserFollowModule } from '../user-follow/user-follow.module';
import { UsersModule } from '../users/users.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    UserFollowModule,
    PongLogModule,
    ChannelModule,
    AchievementModule,
    EventsModule,
    AvatarModule,
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CookieParserMiddleware).forRoutes('/api');
  }
}
