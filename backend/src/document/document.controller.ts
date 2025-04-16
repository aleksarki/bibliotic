import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { DocumentService } from './document.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('document')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

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
    upload(@UploadedFile() file: Express.Multer.File): object {
        if (!file) {
            console.log("[Got no file]");
            throw new BadRequestException("No file provided");
        }
        console.log(`[Saved file '${file.filename}']`);
        return this.documentService.upload(file);
    }
}
