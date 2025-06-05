import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { fromPath } from 'pdf2pic';
import { PDFDocument } from 'pdf-lib';
import { lastValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';
import { existsSync, mkdirSync, promises as fs} from 'fs';

@Injectable()
export class DocumentService {
    constructor(
        private readonly httpService: HttpService,
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}
    
    // Save document
    async upload(file: Express.Multer.File, folder: number, name: string, usr_id: number): Promise<any> {
        const folderOwner = (await this.dataSource.query("SELECT folder_get_owner($1)", [folder]))[0].folder_get_owner;
        if (folderOwner != usr_id) {
            throw new BadRequestException("Attempt to save to not owned folder");
        }

        const textExtractUrl = "http://127.0.0.1:3001/pdf/extract-text";
        const pathParameter = encodeURIComponent(`${process.cwd()}\\upload\\${file.filename}`);
        const request = `${textExtractUrl}?path=${pathParameter}`;

        lastValueFrom(this.httpService.post(request));
        console.log(`[Sent text extraction request for file '${file.filename}']`)

        const document = await this.dataSource.query(
            "CALL document_add($1, $2, $3, $4, $5, $6)",
            [folder, file.filename, new Date(), name.substring(0, 32), null, null]
        );

        return {
            "statusCode": 200,
            "message": `file saved: ${file.filename}`,
            "doc_id": document[0]?.doc_id
        };
    }

    // Get documents inside a folder
    async catalogue(root: number) {
        const items = await this.dataSource.query(
            "SELECT * FROM item_tree_select($1)", [root]
        );
        return items;
    }

    // Get owner (user) of the document
    // If no such document exist, return null
    async getOwner(doc_id: number) {
        try {
            const owner = await this.dataSource.query(
                "SELECT document_get_owner($1)", [doc_id]
            );
            return owner?.[0]?.document_get_owner;
        }
        catch (error) {
            return null;
        }
    }

    // Delete document
    async delete(doc_id: number) {
        try {
            await this.dataSource.query(
                "CALL document_delete($1)", [doc_id]
            );
            return {
                "statusCode": 200,
                "message": `document deleted: ${doc_id}`,
            };
        }
        catch (error) {
            return { "status": "error" }
        }
    }

    // Return name of the document's pdf file
    async getFilename(doc_id: number) {
        try {
            const filePath = await this.dataSource.query(
                "SELECT doc_filename FROM Documents WHERE doc_id=$1;", [doc_id]
            );
            return filePath?.[0]?.doc_filename;
        }
        catch (error) {
            return null;
        }
    }

    // use libraries like: pdf-lib, pdf2pic

    // Check that such file actually exists

    // Implementation here
    // Save in folder './upload/previews/'
    // Return file name of newly created preview picture
    
    // Create and save preview for a pdf file
    async postPreview(doc_filename: string) {
        const docFilePath = `./upload/${doc_filename}`;
        const previewPath = './upload/previews';
        const previewName = `${doc_filename.replace('.pdf', '')}-preview.png`;
        const previewFullPath = `${previewPath}/${previewName}`;

        //The file name matches PDF
        if (!doc_filename.toLowerCase().endsWith('.pdf')) {
            throw new BadRequestException('It\'s not PDF filename');
        }

        //Does PDF file exist
        if (!existsSync(docFilePath)) {
            throw new NotFoundException(`File ${doc_filename} not found.`);
        }

        //If the previews folder does not exist, create it
        if (!existsSync(previewPath)) {
            mkdirSync(previewPath, { recursive: true });
        }
        
        //Delete preview, if it already exist
        if (!existsSync(previewFullPath)) {
            await fs.unlink(`${previewPath}/${previewName}`);
        }

        const options = {
            density: 200,
            saveFilename: previewName.replace('.png', ''),
            savePath: previewPath,
            format: 'png',
            width: 1240,
            height: 1754
        };

        let result;
        try {
            result = await fromPath(docFilePath, options)(1);
        }
        catch (error) {
            throw new BadRequestException(`PDF conversion failed`);
        }

        if (result?.path) {
            const oldPath = result.path;
            const newPath = oldPath.replace('.1', '');
            await fs.rename(oldPath, newPath);
        }

        return previewName;
    }

    // Return preview picture for a document
    async getPreview(doc_id: number) {
        try {
            const fileName = await this.dataSource.query(
                "SELECT doc_preview_get($1);", [doc_id]
            );
            const previewFilePath = './upload/previews/${fileName?.[0]?.doc_preview_get}';

            await fs.access(previewFilePath);
            
            return {
                image: '${baseUrl}/upload/previews/${fileName?.[0]?.doc_preview_get}'
            }
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                // if preview file does not exists
                return "Превью для документа не найдено.";
            }
            return null;
        }
    }
}
