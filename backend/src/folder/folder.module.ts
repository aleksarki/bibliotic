import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [HttpModule, DatabaseModule],
    providers: [FolderService],
    controllers: [FolderController]
})
export class FolderModule {}
