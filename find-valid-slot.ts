import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

type EnvMap = Record<string, string>;

function loadEnv(envPath: string): EnvMap {
  const content = readFileSync(envPath, 'utf8');
  const lines = content.split(/\r?\n/);
  const env: EnvMap = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const equalsIndex = trimmed.indexOf('=');
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }

  return env;
}

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  const envPath = join(process.cwd(), '.env');
  const env = loadEnv(envPath);

  const client = new Client({
    host: env.DB_HOST,
    port: Number(env.DB_PORT ?? '5432'),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
  });

  const vetId = '45c62732-087a-46cd-a953-b8aa070dc5a6';
  const DAYS_TO_SEARCH = 30;

  try {
    await client.connect();

    // Obtener horarios activos del veterinario
    const horariosRes = await client.query(
      `SELECT dia_semana, hora_inicio, hora_fin, activo
       FROM horarios_atencion
       WHERE id_veterinario_fk = $1 AND activo = true
       ORDER BY dia_semana, hora_inicio`,
      [vetId],
    );

    if (horariosRes.rowCount === 0) {
      console.log(`No hay horarios activos configurados para el veterinario ${vetId}.`);
      return;
    }

    const horariosByDay: Record<number, { hora_inicio: string; hora_fin: string }[]> = {};
    for (const row of horariosRes.rows) {
      const dia = Number(row.dia_semana);
      if (!horariosByDay[dia]) horariosByDay[dia] = [];
      horariosByDay[dia].push({ hora_inicio: row.hora_inicio, hora_fin: row.hora_fin });
    }

    // Obtener fechas bloqueadas (propias o globales) en el rango
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + DAYS_TO_SEARCH);

    const bloqueosRes = await client.query(
      `SELECT fecha FROM fechas_bloqueadas
       WHERE (id_veterinario_fk IS NULL OR id_veterinario_fk = $1)
         AND fecha BETWEEN $2 AND $3`,
      [vetId, formatDate(today), formatDate(endDate)],
    );

    const bloqueosSet = new Set<string>(bloqueosRes.rows.map(r => formatDate(new Date(r.fecha))));

    // Buscar el primer día dentro del rango que tenga horario y no esté bloqueado
    for (let i = 0; i <= DAYS_TO_SEARCH; i++) {
      const candidate = new Date();
      candidate.setDate(today.getDate() + i);
      const jsDay = candidate.getDay(); // 0 (Sun) .. 6 (Sat)
      const diaSemana = jsDay === 0 ? 7 : jsDay; // coincide con la convención del backend (1..7, 7=Dom)
      const dateStr = formatDate(candidate);

      if (bloqueosSet.has(dateStr)) continue; // fecha bloqueada

      const slots = horariosByDay[diaSemana];
      if (!slots || slots.length === 0) continue;

      // tomar el primer slot (earliest hora_inicio)
      const slot = slots[0];
      console.log('Franja disponible encontrada:');
      console.log(`Fecha: ${dateStr}`);
      console.log(`Hora inicio: ${slot.hora_inicio}`);
      console.log(`Hora fin: ${slot.hora_fin}`);
      return;
    }

    console.log(`No se encontró ninguna franja disponible en los próximos ${DAYS_TO_SEARCH} días para el veterinario ${vetId}.`);
  } catch (error) {
    console.error('Error al buscar franja válida:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
