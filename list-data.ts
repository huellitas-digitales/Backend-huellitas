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

  try {
    console.log('Conectando a la base de datos...');
    await client.connect();

    const result = await client.query(
      'SELECT id FROM mascotas LIMIT 1',
    );

    if (result.rowCount === 0) {
      console.log('No se encontró ningún registro en la tabla mascotas.');
    } else {
      console.log('ID de mascota encontrado:');
      console.log(result.rows[0].id);
    }
  } catch (error) {
    console.error('Error al consultar la tabla mascotas:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
