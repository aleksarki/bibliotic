import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentService {
    upload(file: Express.Multer.File): object {
        return {"statusCode": 200, "message": "file saved"};
    }
}
