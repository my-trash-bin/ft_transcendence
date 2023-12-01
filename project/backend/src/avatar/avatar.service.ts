import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Buffer } from 'node:buffer';

import { createHash } from 'crypto';
import { Request } from 'express';
import { promises as fs } from 'fs';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AvatarService {
  private readonly logger = new Logger('AvatarService');
  private readonly uploadDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/gif',
  ];

  constructor() {
    this.uploadDir = join(__dirname, '..', 'uploads');
    this.ensureUploadDir();
  }

  // 'uploads' 디렉토리가 없으면 생성
  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch (error) {
      await fs.mkdir(this.uploadDir);
    }
  }

  private generateUniqueFileName(originalName: string): string {
    const fileExtName = extname(originalName);
    const randomName = uuidv4(); // UUID 생성
    return `${randomName}${fileExtName}`;
  }

  private generateHashedFileName(fileBuffer: Buffer): string {
    return createHash('sha256').update(fileBuffer).digest('hex');
  }

  // 이미지 파일 검증 (형식 및 사이즈)
  validateImageFile(file: Express.Multer.File) {
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type.');
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds limit.');
    }
  }

  validateBinaryFile(ctype: string | undefined, file: Buffer) {
    if (!this.allowedMimeTypes.includes(ctype ?? '')) {
      throw new BadRequestException(
        `지원하지 않는 파일 타입. ['image/jpeg', 'image/png', 'image/gif']`,
      );
    }

    if (file.length > this.maxFileSize) {
      throw new BadRequestException('파일 사이즈 제한 초과.');
    }
  }

  // 이미지 파일을 로컬에 저장
  async uploadImg(file: Express.Multer.File) {
    this.validateImageFile(file); // 이미지 검증
    try {
      const uniqueFileName = this.generateUniqueFileName(file.originalname);
      const filePath = join(this.uploadDir, uniqueFileName);
      await fs.writeFile(filePath, file.buffer);
      return { filePath };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async uploadImg2(file: Express.Multer.File) {
    this.validateImageFile(file);

    const hashedFileName = this.generateHashedFileName(file.buffer);
    const filePath = join(this.uploadDir, hashedFileName);

    try {
      await fs.access(filePath);
      return { filePath, isNew: false }; // 이미 존재하는 파일
    } catch (err) {
      await fs.writeFile(filePath, file.buffer);
      return { filePath, isNew: true }; // 새로운 파일 저장
    }
  }

  private async storeFile(
    filepath: string,
    file: Buffer,
  ): Promise<{ ok: Boolean; error?: any }> {
    try {
      try {
        await fs.access(filepath);
      } catch (err) {
        await fs.writeFile(filepath, file);
      }
      return { ok: true }; // 이미 존재하는 파일
    } catch (error) {
      return { ok: false, error }; // 이미 존재하는 파일
    }
  }

  async uploadBinaryData(req: Request): Promise<string> {
    this.limitCheckByContentLength(req);
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      let size = 0;

      req.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
        size += chunk.length;
        this.logger.verbose(
          `chunk ${chunk.length / 1000} kb 수신 => 총 ${size / 1000} kb`,
        );
        if (size > this.maxFileSize) {
          this.logger.verbose(
            `누적 청크 크기 리미트 초과 ${size / (1000 * 1000)}mb > ${
              this.maxFileSize / (1000 * 1000)
            }mb`,
          );
          req.pause();
        }
      });

      req.on('pause', () => {
        reject(new BadRequestException('File size exceeds limit.'));
        setTimeout(() => req.destroy(), 50); // 응답이 전송될 잠깐을 위해서
      });

      req.on('end', async () => {
        try {
          const data = Buffer.concat(buffers);
          const ctype = req.headers['content-type'];

          this.logger.debug(
            `바이너리 업로드 종료: 크기 ${data.length}, content-type: ${ctype}`,
          );

          this.validateBinaryFile(ctype, data);

          const ext = ctype?.slice('image/'.length);
          const hashedFileName = this.generateHashedFileName(data);
          const filePath = join(this.uploadDir, hashedFileName + '.' + ext);

          const returnFilePath = join(
            'http://localhost:60080',
            'uploads',
            hashedFileName + '.' + ext,
          );

          const { ok, error } = await this.storeFile(filePath, data);
          if (!ok) {
            throw error;
          }
          resolve(returnFilePath);
        } catch (error) {
          reject(error);
        }
      });

      req.on('error', (err) => {
        this.logger.error(`바이너리 업로드 중 에러 발생: ${err}`);
        reject(err);
      });
    });
  }
  private limitCheckByContentLength(req: Request) {
    const contentLength = req.headers['content-length'];
    if (contentLength && parseInt(contentLength) > this.maxFileSize) {
      throw new BadRequestException(
        '파일 사이즈 제한 초과. (by content-length)',
      );
    }
  }
}
