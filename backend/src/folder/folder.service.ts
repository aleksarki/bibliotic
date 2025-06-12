import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { fromPath } from 'pdf2pic';
import { PDFDocument } from 'pdf-lib';
import { lastValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { existsSync, mkdirSync, promises as fs, readFileSync} from 'fs';

@Injectable()
export class FolderService {
    constructor(
        private readonly httpService: HttpService,
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}

    // Get owner (user) of the folder
    // If no such folder exist, return null
    async getOwner(fldr_id: number) {
        try {
            const owner = await this.dataSource.query(
                "SELECT folder_get_owner($1)", [fldr_id]
            );
            return owner?.[0]?.folder_get_owner;
        }
        catch (error) {
            return null;
        }
    }

    // Rename a folder
    async rename(fldr_id: number, fldr_newName: string) {
        try {
            await this.dataSource.query(
                "UPDATE Folders SET fldr_name=$1 WHERE fldr_id=$2;", [fldr_newName, fldr_id]
            );
            return {"status": "successful rename"};
        }
        catch (error) {
            return null;
        }
    }

    // Create a folder
    async create(fldr_id: number, fldr_name: string) {
        try {
            await this.dataSource.query(
                "CALL folder_add($1, $2, NULL)", [fldr_id, fldr_name]
            );
            return {"status": "successful creation"};
        }
        catch (error) {
            return null;
        }
    }
}