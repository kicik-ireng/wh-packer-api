import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Register endpoint
  @Post('register')
  async register(@Body() createAdminDto: CreateAdminDto) {
    const admins = await this.adminService.findAll();
    if (admins.length > 0) {
      throw new Error('Admin sudah ada, registrasi ditutup');
    }
    return this.adminService.create(createAdminDto);
  }

  // Login endpoint
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    const admin = await this.adminService.findByUsername(username);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = jwt.sign(
      { adminId: admin.id },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' },
    );
    return { token };
  }

  // All below
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.remove(id);
  }
}
