import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @IsNotEmpty()
  @IsInt()
  projectId: number;

  @IsOptional()
  @IsInt()
  assignedToId?: number | null;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
