import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { email, password } = loginDto;
    return this.authService.loginWithEmail(email, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google')) // Initiates Google authentication
  async googleLogin() {
    // This route just triggers Google OAuth flow.
  }

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard) // Use GoogleAuthGuard to protect callback
  async googleLoginCallback(@Req() req) {
    const profile = req.user;
    return this.authService.loginWithGoogle(profile);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user; // Returns user info from JWT token
  }
}
