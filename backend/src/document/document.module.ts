import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from 'src/database/database.module';

@Module({
	imports: [HttpModule, DatabaseModule],
	providers: [DocumentService],
	controllers: [DocumentController]
})
export class DocumentModule {}
