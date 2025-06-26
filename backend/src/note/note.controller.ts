import { Controller, Post, Body, Get, Param, UseGuards, Request, Query, BadRequestException } from "@nestjs/common";
import { NoteService } from "./note.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller('note')
export class NoteController {
    constructor(private readonly noteService: NoteService) {}

    //@Get("")
    //async 

    @UseGuards(JwtAuthGuard)
    @Post("create")
    async create(@Request() request, @Body() body: {
        document: number,
        page: number,
        text: string,
        x: number,
        y: number
    }) {
        if (!body) {
            throw new BadRequestException("Wrong");
        }
        const {document, page, text, x, y} = body;
        if (!(document && page && text && x && y)) {
            throw new BadRequestException("Incomplete input");
        }
        return this.noteService.create(document, page, text, x, y)[0];
    }

    @UseGuards(JwtAuthGuard)
    @Get("get")
    async get(@Request() request, @Query("document") document: number) {
        if (!document) {
            throw new BadRequestException("Incomplete input");
        }
        return this.noteService.get(document);
    }
}
