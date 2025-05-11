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
        const payload = {
            usr_id: user.usr_id,
            usr_email: user.usr_email,
            usr_root: user.usr_root
        };
        return {
            access_token: this.jwtService.sign(payload)
        };
    }
}
