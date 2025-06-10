import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { DocumentService } from './document.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', {
        fileFilter: (req, file, cb) => {
            if (file.mimetype.match(/\/(pdf)$/)) {
                cb(null, true);
            }
            else {
                console.log("[Got file of wrong format]")
                cb(new BadRequestException("Unsupported file type"), false);
            }
        },
        storage: diskStorage({
            destination: (req, file, cb) => {
                const path = './upload';
                if (!existsSync(path)) {
                    mkdirSync(path);
                    console.log("[Created /upload directory]");
                }
                cb(null, path);
            },
            filename: (req, file, cb) => {
                console.log(`[Received file '${file.originalname}']`)
                cb(null, `${uuid()}${extname(file.originalname)}`);
            }
        })
    }))
    upload(
        @Request() request,
        @UploadedFile() file: Express.Multer.File,
        @Body("folder") folder: number,
        @Body("name") name: string
    ): object {
        if (!file) {
            console.log("['/document/upload' Bad request: got no file]");
            throw new BadRequestException("'file' field not provided");
        }
        if (!folder) {
            console.log("['/document/upload' Bad request: got no folder]");
            throw new BadRequestException("'folder' field not provided")
        }
        if (!name) {
            console.log("['/document/upload' Bad request: got no name]");
            throw new BadRequestException("'name' field not provided")
        }
        console.log(`['/document/upload' Saved file '${file.filename}']`);
        return this.documentService.upload(file, folder, name, request.user.usr_id);
    }

    // Return user their documents
    @UseGuards(JwtAuthGuard)
    @Get("catalogue")
    catalogue(@Request() request) {
        return this.documentService.catalogue(request.user.usr_root);
    }

    // Delete a document
    @UseGuards(JwtAuthGuard)
    @Delete("delete")
    async delete(@Request() request, @Query("doc_id") doc_id: number) {
        if (request.user.usr_id != await this.documentService.getOwner(doc_id)) {
            return {"error": "Unaccessible document"};
        }
        return this.documentService.delete(doc_id);
    }

    // Save preview for a pdf file
    @Post("preview")
    async postPreview(@Query("doc_filename") doc_filename: string) {
        return this.documentService.postPreview(doc_filename);
    }

    // Return preview for a document
    @UseGuards(JwtAuthGuard)
    @Get("preview")
    async getPreview(@Request() request, @Query("doc_id") doc_id: number) {
        return this.documentService.getPreview(doc_id);
    }
}
