import {
  Controller,
  Post,
  Body,
  Get,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';

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
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    try {
      const user = req.user; // This should contain user info from Google
      const tokens = await this.authService.loginWithGoogle(user);

      // Construct the frontend callback URL with tokens as query parameters
      const frontendUrl = 'http://localhost:3001/google-callback';
      const redirectUrl = `${frontendUrl}?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}&email=${encodeURIComponent(
        tokens.email,
      )}&name=${encodeURIComponent(tokens.name)}&role=${tokens.role}`;

      // Redirect the user to the frontend with the tokens
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Error during Google OAuth callback:', error);
      res.redirect('http://localhost:3001/login'); // Redirect to login on error
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user; // Returns user info from JWT token
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }
}
