import { readFileSync } from 'fs';
import { join } from 'path';
import { Client } from 'pg';

type EnvMap = Record<string, string>;
const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

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

  const veterinarianId = '987fcdeb-51a2-43d7-9012-345678901234';

  try {
    console.log('Conectando a la base de datos...');
    await client.connect();

    const result = await client.query(
      `SELECT dia_semana, hora_inicio, hora_fin, activo
       FROM horarios_atencion
       WHERE id_veterinario_fk = $1
       ORDER BY dia_semana, hora_inicio`,
      [veterinarianId],
    );

    if (result.rowCount === 0) {
      console.log(`No se encontró horario para el veterinario ${veterinarianId}.`);
      return;
    }

    console.log(`Horario de atención para veterinario ${veterinarianId}:`);
    for (const row of result.rows) {
      const dayIndex = Number(row.dia_semana);
      const dayName = DAY_NAMES[dayIndex] ?? `Día ${row.dia_semana}`;
      const status = row.activo ? 'Activo' : 'Inactivo';
      console.log(`- ${dayName}: ${row.hora_inicio} a ${row.hora_fin} (${status})`);
    }
  } catch (error) {
    console.error('Error al consultar el horario de atención:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
