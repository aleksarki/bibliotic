import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(@Inject("USER_REPOSITORY") private userRepository: Repository<User>) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(usr_email: string): Promise<User | undefined> {
        return (await this.userRepository.find()).find(user => user.usr_email === usr_email);
    }
}
