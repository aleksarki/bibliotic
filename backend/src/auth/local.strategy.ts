import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({ usernameField: "email", passwordField: "password" });
    }

    async validate(usr_email: string, usr_pswrd: string): Promise<any> {
        const user = await this.authService.validateUser(usr_email, usr_pswrd);
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
