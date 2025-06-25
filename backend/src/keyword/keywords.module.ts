import { Module } from '@nestjs/common';
import { KeywordsService } from './keywords.service';
import { KeywordsController } from './keywords.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [KeywordsService],
  controllers: [KeywordsController],
  exports: [KeywordsService]
})
export class KeywordsModule {}