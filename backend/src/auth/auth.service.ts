import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}

    async register(usr_email: string, usr_hash: string) {
        try {
            const acc = await this.dataSource.query(
                "CALL account_create($1, $2, $3, $4)",
                [usr_email, usr_hash, null, null]
            )
            return acc[0]   
        }
        catch (error) {
            throw new BadRequestException("Error while creating new account")
        }
    }

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
