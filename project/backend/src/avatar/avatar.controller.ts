import { Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { JwtGuard } from '../auth/jwt.guard';
import { AvatarService } from './avatar.service';

@ApiTags('avatar')
@Controller('/api/v1/avatar')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  @ApiOperation({ summary: '바이너리 아바타 업로드' })
  @Post('upload')
  @UseGuards(JwtGuard)
  async uploadFile(@Req() req: Request, @Res() res: Response) {
    try {
      const filePath = await this.avatarService.uploadBinaryData(req);
      res.status(201).json({ filePath });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file', error });
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
