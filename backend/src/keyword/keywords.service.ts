import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class KeywordsService {
  constructor(
    @Inject("DATA_SOURCE") private dataSource: DataSource
  ) {}

  async createKeywords(keywords: string[], docId: number): Promise<any> {
    try {
      // Сначала удаляем старые ключевые слова для этого документа
      await this.dataSource.query(
        'DELETE FROM keywords WHERE kwrd_document = $1',
        [docId]
      );
      
      // Затем добавляем новые ключевые слова
      const results = await Promise.all(
        keywords.map(keyword => 
          this.dataSource.query(
            `INSERT INTO keywords (kwrd_keyword, kwrd_document) VALUES ($1, $2) RETURNING *`,
            [keyword, docId]
          )
        )
      );
      
      return results.flat();
    } catch (error) {
      console.error('Error creating keywords:', error);
      throw new BadRequestException('Failed to create keywords');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await this.dataSource.query('SELECT * FROM keywords');
    } catch (error) {
      console.error('Error fetching keywords:', error);
      throw new BadRequestException('Failed to fetch keywords');
    }
  }

  async findByDocument(docId: number): Promise<any[]> {
    try {
      return await this.dataSource.query(
        'SELECT * FROM keywords WHERE kwrd_document = $1',
        [docId]
      );
    } catch (error) {
      console.error(`Error fetching keywords for document ${docId}:`, error);
      throw new BadRequestException(`Failed to fetch keywords for document ${docId}`);
    }
  }
}