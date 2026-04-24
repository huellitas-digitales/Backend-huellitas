import { PartialType } from '@nestjs/swagger';
import { CreateHospitalizacioneDto } from './create-hospitalizacione.dto';

export class UpdateHospitalizacioneDto extends PartialType(CreateHospitalizacioneDto) {}
