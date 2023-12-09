import { Controller, Logger, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { AvatarService } from './avatar.service';

export class FilePathResponse {
  @ApiProperty({ description: '저장된 파일 경로' })
  filepath!: string;
}

@ApiTags('avatar')
@Controller('/api/v1/avatar')
export class AvatarController {
  private readonly logger = new Logger('AvatarContoller');

  constructor(private readonly avatarService: AvatarService) {}

  @ApiOperation({ summary: '바이너리 아바타 업로드' })
  @ApiCreatedResponse({
    description: '이미지 URL 리턴',
    type: () => FilePathResponse,
  })
  @ApiBody({ description: '바이너리 이미지 파일', type: 'file' })
  @Post('upload')
  @UseGuards(JwtGuard)
  async uploadFile(@Req() req: Request) {
    try {
      const filePath = await this.avatarService.uploadBinaryData(req);
      this.logger.log(`업로드 성공: ${filePath}`);
      return { filePath };
    } catch (error) {
      this.logger.log(`업로드 실패: ${error}`);
      throw error;
    }
  }
  // @Post('upload-with-multer')
  // @UseInterceptors(FileInterceptor('file'))
  // @UseGuards(JwtGuard)
  // async uploadFile2(@UploadedFile() file: Express.Multer.File) {
  //   console.log(`upload: ${file}`);
  //   const { filePath } = await this.avatarService.uploadImg(file);
  //   return filePath;
  // }
}
