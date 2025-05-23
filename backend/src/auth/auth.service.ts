import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { AuthTokens, JwtPayload } from './types/auth.types';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as ms from 'ms';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  private getRefreshToken(): string {
    return this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRES');
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !(await this.validatePassword(user, password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  login(user: Pick<User, 'id' | 'email'>): AuthTokens {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        expiresIn: this.getRefreshToken(),
      }),
    };
  }

  async signup(dto: CreateUserDto): Promise<AuthTokens> {
    const user = await this.usersService.create(dto);
    return this.login(user);
  }

  refreshToken(token?: string): Pick<AuthTokens, 'access_token'> {
    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(token);

      const newPayload = { sub: payload.sub, email: payload.email };

      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getCookieOptions(): Record<string, any> {
    return {
      httpOnly: true,
      secure:
        this.configService.getOrThrow<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    };
  }

  setRefreshTokenCookie(res: Response, refresh_token: string) {
    res.cookie('refresh_token', refresh_token, {
      ...this.getCookieOptions(),
      maxAge: ms(this.getRefreshToken() as ms.StringValue),
    });
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refresh_token', this.getCookieOptions());
  }
}
