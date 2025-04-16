import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
	imports: [HttpModule],
	providers: [DocumentService],
	controllers: [DocumentController]
})
export class DocumentModule {}
