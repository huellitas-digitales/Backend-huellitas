import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InteraccionesBotService } from './interacciones_bot.service';
import { CreateInteraccionesBotDto } from './dto/create-interacciones_bot.dto';
import { UpdateInteraccionesBotDto } from './dto/update-interacciones_bot.dto';

@Controller('interacciones-bot')
export class InteraccionesBotController {
  constructor(private readonly interaccionesBotService: InteraccionesBotService) {}

  @Post()
  create(@Body() createInteraccionesBotDto: CreateInteraccionesBotDto) {
    return this.interaccionesBotService.create(createInteraccionesBotDto);
  }

  @Get()
  findAll() {
    return this.interaccionesBotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interaccionesBotService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInteraccionesBotDto: UpdateInteraccionesBotDto) {
    return this.interaccionesBotService.update(+id, updateInteraccionesBotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interaccionesBotService.remove(+id);
  }
}
