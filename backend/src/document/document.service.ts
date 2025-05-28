import { HttpService } from '@nestjs/axios';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { DataSource } from 'typeorm';

@Injectable()
export class DocumentService {
    constructor(
        private readonly httpService: HttpService,
        @Inject("DATA_SOURCE") private dataSource: DataSource
    ) {}
    
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

    async catalogue(root: number) {
        const items = await this.dataSource.query(
            "SELECT * FROM item_tree_select($1)", [root]
        );
        return items;
    }

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
}
