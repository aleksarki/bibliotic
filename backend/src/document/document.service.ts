import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class DocumentService {
    constructor(private readonly httpService: HttpService) {}
    
    upload(file: Express.Multer.File): object {
        const textExtractUrl = "http://127.0.0.1:3001/pdf/extract-text";
        const pathParameter = encodeURIComponent(`${process.cwd()}\\upload\\${file.filename}`);
        const request = `${textExtractUrl}?path=${pathParameter}`;

        lastValueFrom(this.httpService.post(request));
        console.log(`[Sent text extraction request for file '${file.filename}']`)

        return {"statusCode": 200, "message": `file saved: ${file.filename}`};
    }
}
