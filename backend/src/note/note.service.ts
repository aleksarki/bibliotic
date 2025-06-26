import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class NoteService {
    constructor(
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}

    // Create new note
    async create(
        document: number,
        page: number,
        text: string,
        x: number,
        y: number
    ) {
        try {
            const note = await (this.dataSource.query(
                "CALL note_add($1, $2, $3, $4, $5, NULL);",
                [document, page, text, x, y]
            ));
            return note[0];
        }
        catch {
            throw new BadRequestException("Error");
        }
    }

    // Get notes of a document
    async get(document: number) {
        try {
            return await (this.dataSource.query(
                "SELECT * FROM document_get_notes($1);",
                [document]
            ));
        }
        catch {
            throw new BadRequestException("Error");
        }
    }
}
