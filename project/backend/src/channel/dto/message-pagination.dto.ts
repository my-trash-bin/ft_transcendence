import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class MessagePaginationDto {
  @ApiProperty({
    description: '이전 페이지의 마지막 메시지 생성 시간 커서',
    required: false,
    type: String,
    example: '2023-03-28T12:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  cursorTimestamp?: string;

  @ApiProperty({
    description: '페이지당 메시지 수',
    required: false,
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;
}
