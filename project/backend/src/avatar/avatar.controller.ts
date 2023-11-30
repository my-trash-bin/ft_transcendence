import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { AvatarService } from './avatar.service';

@ApiTags('avatar')
@Controller('/api/v1/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiOperation({ summary: '바이너리 아바타 업로드' })
  @ApiCreatedResponse({
    description: '이미지 URL 리턴',
    type: String,
  })
  @ApiBody({ description: '바이너리 이미지 파일', type: 'file' })
  @Post('upload')
  @UseGuards(JwtGuard)
  async uploadFile(@Req() req: Request) {
    try {
      const filePath = await this.avatarService.uploadBinaryData(req);
      console.log(filePath);
      return { filePath };
      // res.status(201).json({ filePath });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
      // {
      //   "message": "Bad Request",
      //   "statusCode": 400
      // }
      // res.status(500).json({ message: 'Error uploading file', error });
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
