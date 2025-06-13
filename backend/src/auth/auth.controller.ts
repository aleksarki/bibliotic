import { BadRequestException, Body, Query, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    async register(@Body("email") email: string, @Body("password") password: string) {
        if (!email) {
            throw new BadRequestException("'email' field not provided")
        }
        if (!password) {
            throw new BadRequestException("'password' field not provided")
        }
        return this.authService.register(email, password);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() request) {
        return this.authService.login(request.user);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() request) {
        // request.logout();
        return;
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    getUser(@Request() request) {
        return request.user;
    }

    @UseGuards(JwtAuthGuard)
    @Get('password-change')
    passwordChange(@Request() request, @Query("hashOld") hashOld: string, @Query("hashNew") hashNew: string) {
        return this.authService.passwordChange(request.user, hashOld, hashNew);
    }
}