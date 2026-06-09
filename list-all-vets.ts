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
      `SELECT u.id, u.email, r.nombre as rol
       FROM usuarios u
       LEFT JOIN roles r ON u.id_rol_fk = r.id
       WHERE LOWER(r.nombre) LIKE '%veterinario%'
       ORDER BY u.email`);

    if (result.rowCount === 0) {
      console.log('No se encontraron usuarios con rol Veterinario.');
      return;
    }

    console.log('Veterinarios encontrados:');
    for (const row of result.rows) {
      console.log(`- id: ${row.id}  email: ${row.email}  rol: ${row.rol}`);
    }
  } catch (error) {
    console.error('Error al listar veterinarios:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
