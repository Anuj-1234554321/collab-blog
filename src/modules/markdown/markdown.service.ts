import { Injectable } from '@nestjs/common';
import { marked } from 'marked';

@Injectable()
export class MarkdownService {
    async parseMarkdown(markdown: string): Promise<string> {
      return marked.parse(markdown);
    }
  }