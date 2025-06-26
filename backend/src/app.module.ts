import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { DocumentModule } from './document/document.module';
import { FolderModule } from './folder/folder.module';
import { KeywordsModule } from './keyword/keywords.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    DatabaseModule,
    DocumentModule,
    FolderModule,
    KeywordsModule,
    UserModule,
    NoteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
