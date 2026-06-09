import { Module } from '@nestjs/common';
import { MedicinaController } from './medicina.controller';
import { MedicinaService } from './medicina.service';

@Module({
  controllers: [MedicinaController],
  providers: [MedicinaService],
})
export class MedicinaModule {}
