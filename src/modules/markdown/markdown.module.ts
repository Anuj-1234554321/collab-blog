import { Module } from '@nestjs/common';
import { MarkdownService } from './markdown.service';
import { MarkdownController } from './markdown.controller';


@Module({
  providers: [MarkdownService],
  exports: [MarkdownService],
  controllers: [MarkdownController], // Export so other modules can use it
})
export class MarkdownModule {}
