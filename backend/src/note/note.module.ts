import { Module } from "@nestjs/common";
import { NoteService } from "./note.service";
import { NoteController } from "./note.controller";
import { DatabaseModule } from "src/database/database.module";

@Module({
    imports: [DatabaseModule],
    providers: [NoteService],
    controllers: [NoteController],
    exports: [NoteService]
})
export class NoteModule {}
