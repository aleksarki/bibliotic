import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { HttpModule } from '@nestjs/axios';
import { DatabaseModule } from '../database/database.module';
import { KeywordsModule } from '../keyword/keywords.module';

@Module({
  imports: [HttpModule, DatabaseModule, KeywordsModule],
  providers: [DocumentService],
  controllers: [DocumentController]
})
export class DocumentModule {}
