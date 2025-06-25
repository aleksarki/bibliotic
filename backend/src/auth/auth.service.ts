import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/users/user.service';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}

    async register(usr_email: string, usr_pswrd: string) {
        try {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(usr_pswrd, salt);
            const acc = await this.dataSource.query(
                "CALL account_create($1, $2, $3, $4)",
                [usr_email, hash, null, null]
            )
            return acc[0]
        }
        catch (error) {
            console.error(error);
            throw new BadRequestException("Error while creating new account")
        }
    }

    /**
     * Retrieve the user and validate the password.
     */
    async validateUser(usr_email: string, usr_pswrd: string): Promise<any> {
        const user = await this.userService.findOneByEmail(usr_email);

        if (!user || !user.usr_hash) {
            return null;
        }

        const cmpr = await bcrypt.compare(usr_pswrd, user?.usr_hash);

        if (cmpr) {
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


    async passwordChange(user: any, hashOld: string, hashNew: string) {
        try {
            const hash = await this.dataSource.query(
                "SELECT usr_hash FROM users WHERE usr_id = $1", [user.usr_id]);
                
            if (hash[0].usr_hash == hashOld) {
                await this.dataSource.query(
                    "UPDATE users SET usr_hash = $1 WHERE usr_id = $2", [hashNew, user.usr_id]);
            }
            else {
                throw new BadRequestException("Passwords hashes don't match")
            }
        }
        catch (error) {
            throw new BadRequestException("Error while changing password")
        }
    }
}
