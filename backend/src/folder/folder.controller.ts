import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid'
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { FolderService } from './folder.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('folder')
export class FolderController {
    constructor(private readonly folderService: FolderService) {}

    // Rename a folder
    @UseGuards(JwtAuthGuard)
    @Patch("rename")
    async rename(@Request() request, @Query("fldr_id") fldr_id: number, @Query("fldr_newName") fldr_newName: string) {
        if (request.user.usr_id != await this.folderService.getOwner(fldr_id)) {
            return { "error": "Unaccessible folder"};
        }
        if (request.user.usr_root == fldr_id) {
          return { "error": "Unable to rename root folder"}
        }
        return this.folderService.rename(fldr_id, fldr_newName);
    }
}

