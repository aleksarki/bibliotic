import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) {}

    /**
     * Retrieve the user and validate the password.
     */
    async validateUser(usr_email: string, usr_pswrd: string): Promise<any> {
        const user = await this.userService.findOneByEmail(usr_email);
        // FIX: USE BCRYPT
        const usr_hash = usr_pswrd;
        if (user && user.usr_hash === usr_hash) {
            const {usr_hash, ...result} = user;
            return result;
        }
        return null;
    }

    /**
     * Return JWT.
     */
    async login(user: any) {
        const payload = {username: user.usr_email, sub: user.usr_id};
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
