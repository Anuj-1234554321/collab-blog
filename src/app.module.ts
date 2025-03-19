import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './global.module';
import { MarkdownService } from './modules/markdown/markdown.service';


@Module({
  imports: [GlobalModule],
  controllers: [AppController],
  providers: [AppService, MarkdownService],
})
export class AppModule {}
