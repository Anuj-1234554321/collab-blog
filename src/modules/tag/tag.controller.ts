import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { Public } from '../auth/gaurds/roles.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @Public()
  create(@Body() dto: CreateTagDto) {
    return this.tagService.create(dto);
  }

  @Get()
  @Public()
  findAll() {
    return this.tagService.findAll();
  }

  
  @Get(':id')
  @Public()

  findOne(@Param('id') id: number) {
    return this.tagService.findOne(id);
  }

  @Delete(':id')
  @Public()
  delete(@Param('id') id: number) {
    return this.tagService.delete(id);
  }
}
