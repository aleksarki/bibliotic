import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

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
}