import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Post()
  async create(@Body() body: { keywords: string[], docId: number }) {
    return await this.keywordsService.createKeywords(body.keywords, body.docId);
  }

  @Get()
  async findAll() {
    return await this.keywordsService.findAll();
  }

  @Get(':docId')
  async findByDocument(@Param('docId') docId: number) {
    return await this.keywordsService.findByDocument(docId);
  }
}