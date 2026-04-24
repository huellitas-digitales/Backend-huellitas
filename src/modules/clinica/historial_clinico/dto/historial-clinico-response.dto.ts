// src/modules/clinica/historial_clinico/dto/historial-clinico-response.dto.ts

export class HistorialClinicoResponseDto {
  id: string;
  fecha_consulta: Date;
  motivo_consulta: string;
  sintomas: string | null;
  peso_actual_kg: number;
  diagnostico: string;
  notas_internas: string | null;

  veterinario: {
    id: string;
    nombres: string;
    apellidos: string;
    email: string;
  };

  mascota: {
    id: string;
    nombre: string;
    sexo: string;
    // Agrega aquí cualquier otro dato público de la mascota que te sirva
  };

  cita: {
    id: string;
    estado: string;
  };
}