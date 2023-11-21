// // user.controller.ts
// import { Body, Controller, Get, Post, Query } from '@nestjs/common';
// import {
//   ApiBearerAuth,
//   ApiOperation,
//   ApiResponse,
//   ApiTags,
// } from '@nestjs/swagger';
// import {
//   CreateUserDto,
//   NicknameDto,
//   TargetUserDto,
//   UserPayload,
// } from './user.dto';
// import { UserService } from './user.service';

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): UserPayload => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user;
//   },
// );

// @ApiTags('users')
// @ApiBearerAuth('access-token')
// @Controller('users')
// export class UserController {
//   constructor(private readonly userService: UserService) {}

//   @Post()
//   @ApiOperation({ summary: 'Create a new user' })
//   @ApiResponse({
//     status: 201,
//     description: 'The user has been successfully created.',
//   })
//   @ApiResponse({ status: 403, description: 'Forbidden.' })
//   @ApiResponse({ status: 409, description: 'Conflict.' })
//   async create(@Body() createUserDto: CreateUserDto) {
//     return this.userService.create(createUserDto);
//   }

//   @Get()
//   @ApiOperation({ summary: 'Get all users' })
//   @ApiResponse({ status: 200, description: 'Return all users.' })
//   async() {
//     return this.userService.findAll();
//   }

//   @Post('unique-check')
//   @ApiResponse({ status: 200, description: 'Nickname check request accepted.' })
//   @ApiResponse({ status: 401, description: 'unauthorized.' })
//   @ApiResponse({ status: 403, description: 'forbidden.' })
//   // @ApiResponse({ status: 409, description: 'Nickname already exists.' })
//   async checkNickname(@Body() dto: NicknameDto) {
//     // 닉네임 중복 체크 로직 구현
//     const { nickname } = dto;
//     const isUnique = await this.userService.checkNicknameAvailability(nickname);
//     return { isUnique };
//   }

//   @Get('profile')
//   @ApiOperation({ summary: 'Get targetUses profile info' })
//   @ApiResponse({ status: 200, description: 'Return targetuser profile info.' })
//   @ApiResponse({ status: 400, description: 'Invalid id.' })
//   @ApiResponse({ status: 401, description: 'unauthorized.' })
//   @ApiResponse({ status: 403, description: 'forbidden.' })
//   async findAll(@Query('targetUser') id: string) {
//     return this.userService.findProfile(id); // 본인, 타인 통합인듯
//   }

//   // @Get('my-profile')
//   // @ApiOperation({ summary: 'Get my profile info.' })
//   // @ApiResponse({ status: 200, description: 'Return my profile info.' })
//   // async myProfile(@Req() req) {
//   //   const user = req.user; // 토큰에서 추출된 사용자 정보
//   //   return this.userService.findMyProfile(user.userId);
//   // }

//   // ************* 친구 ************** //

//   @Post('friends/request')
//   async addFriend(@User() user: UserPayload, @Body() dto: TargetUserDto) {
//     const isUnique = await this.userService.addFriend(user.id, dto.id);
//     return { isUnique };
//   }

//   @Post('friends/unfriend')
//   async removeFriend(@User() user: UserPayload, @Body() dto: TargetUserDto) {
//     const isUnique = await this.userService.addFriend(user.id, dto.id);
//     return { isUnique };
//   }

//   @Post('friends/block')
//   async blockUser(@User() user: UserPayload, @Body() dto: TargetUserDto) {
//     const isUnique = await this.userService.addFriend(user.id, dto.id);
//     return { isUnique };
//   }

//   @Post('friends/unblock')
//   async unblockUser(@User() user: UserPayload, @Body() dto: TargetUserDto) {
//     const isUnique = await this.userService.addFriend(user.id, dto.id);
//     return { isUnique };
//   }

//   // ************* 친구 끝 ************** //
// }
