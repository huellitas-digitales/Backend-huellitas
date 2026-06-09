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

  const dbHost = env.DB_HOST;
  const dbPort = Number(env.DB_PORT ?? '5432');
  const dbUser = env.DB_USER;
  const dbName = env.DB_NAME;
  const dbPassword = env.DB_PASSWORD;

  if (!dbHost || !dbUser || !dbName) {
    console.error('Faltan variables de configuración de la base de datos en .env.');
    process.exit(1);
  }

  const client = new Client({
    host: dbHost,
    port: dbPort,
    user: dbUser,
    password: dbPassword,
    database: dbName,
  });

  try {
    console.log('Conectando a la base de datos...');
    await client.connect();

    const email = 'admin@huellitas.com';
    const result = await client.query(
      `SELECT email, estado_cuenta, bloqueado_hasta FROM usuarios WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (result.rowCount === 0) {
      console.log(`Usuario no encontrado: ${email}`);
    } else {
      const row = result.rows[0];
      console.log(`Usuario encontrado: ${row.email}`);
      console.log(`estado_cuenta: ${row.estado_cuenta}`);
      console.log(`bloqueado_hasta: ${row.bloqueado_hasta}`);
    }
  } catch (error) {
    console.error('Error al consultar el usuario:', error);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();
