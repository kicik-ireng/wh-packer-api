import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const jwt = await this.authService.login(
      loginDto.username,
      loginDto.password,
    );

    res.cookie('token', jwt.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 hari
    });

    return { message: 'Login successful' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
    return { message: 'Logout successful' };
  }

  @Post('verify')
  async verify(@Req() req: Request) {
    const token = req.cookies['token'];
    // console.log('JWT dari cookie:', token);

    if (!token) throw new UnauthorizedException('No token found');

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'secretKey',
      });
      return { valid: true, username: payload.username };
    } catch (err) {
      console.error('Token tidak valid:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
