import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../common/pagination.dto';

export class AdminQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  Name?: string;

  @IsOptional()
  @IsString()
  UserName?: string;

  @IsOptional()
  @IsString()
  RoleName?: string;

  @IsOptional()
  @IsString()
  Action?: string;

  @IsOptional()
  @Transform(({ value }) => (value === 'true' ? true : value === 'false' ? false : value))
  @IsBoolean()
  IsActive?: boolean;
}

export class AssignRoleDto {
  @IsOptional()
  @IsInt()
  RoleId?: number | null;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;
}

export class RoleBodyDto {
  @IsString()
  RoleName: string;

  @IsOptional()
  @IsString()
  Description?: string;

  @IsOptional()
  @IsBoolean()
  IsActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  PermissionActions: string[];
}
