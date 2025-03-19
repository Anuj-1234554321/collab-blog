import { Controller, Post, Body } from '@nestjs/common';
import * as marked from 'marked';
import { Public } from '../auth/gaurds/roles.decorator';

@Controller('markdown')
export class MarkdownController {
  @Public()
  @Post('convert')
  async convertMarkdownToHtml(@Body('markdown') markdown: string): Promise<{ html: string }> {
    const html = await marked.parse(markdown); // Await the Promise
    return { html };
  }
}


