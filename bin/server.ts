/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
*/

await import('reflect-metadata')

const fs = await import('node:fs')
const dotenv = await import('dotenv')

const APP_ROOT = new URL('../', import.meta.url)

/**
 * .env / .env.local ne FILE thi j parse kare chhe — process.env ne
 * touch nathi karto. Adonis nu potanu loader baaki badha vars
 * (APP_URL, HOST, PORT etc.) normal rite interpolate karse.
 */
function loadEnvFile(fileName: string) {
    const filePath = new URL(fileName, APP_ROOT)
    return fs.existsSync(filePath) ? dotenv.parse(fs.readFileSync(filePath)) : {}
}

const parsedEnv = {
    ...loadEnvFile('.env'),
    ...loadEnvFile('.env.local'), // Adonis ni jem j .env.local ne priority
}

// real process.env (shell export / production host) hoy to e j priority,
// nahi to parsed .env file ni value
const read = (key: string) => process.env[key] ?? parsedEnv[key]

const { Ignitor, prettyPrintError } = await import('@adonisjs/core')

const IMPORTER = (filePath: string) => {
    if (filePath.startsWith('./') || filePath.startsWith('../')) {
        return import(new URL(filePath, APP_ROOT).href)
    }
    return import(filePath)
}

/**
 * Local Postgres try kare chhe, na male to Neon (DATABASE_URL) par
 * fallback. Production ma seedhu Neon. FINAL values j process.env
 * ma set thay chhe — PG_HOST/PORT/USER/PASSWORD/DB_NAME/SSL sivay
 * koi biju var touch nathi thatu.
 */
async function resolveDbConnection() {
    const useNeon = () => {
        const neonUrl = new URL(read('DATABASE_URL')!)
        process.env.PG_HOST = neonUrl.hostname
        process.env.PG_PORT = neonUrl.port || '5432'
        process.env.PG_USER = decodeURIComponent(neonUrl.username)
        process.env.PG_PASSWORD = decodeURIComponent(neonUrl.password)
        process.env.PG_DB_NAME = neonUrl.pathname.replace(/^\//, '')
        process.env.PG_SSL = 'true'
    }

    if (read('NODE_ENV') === 'production') {
        useNeon()
        console.log('✅ Production — Neon nu connection set thayu')
        return
    }

    const { Client } = await import('pg')
    const client = new Client({
        host: read('PG_HOST'),
        port: Number(read('PG_PORT')),
        user: read('PG_USER'),
        password: read('PG_PASSWORD'),
        database: read('PG_DB_NAME'),
        connectionTimeoutMillis: 2000,
    })

    try {
        await client.connect()
        await client.end()
        process.env.PG_HOST = read('PG_HOST')
        process.env.PG_PORT = read('PG_PORT')
        process.env.PG_USER = read('PG_USER')
        process.env.PG_PASSWORD = read('PG_PASSWORD')
        process.env.PG_DB_NAME = read('PG_DB_NAME')
        process.env.PG_SSL = 'false'
        console.log('✅ Local Postgres connected')
    } catch {
        console.log('⚠️ Local Postgres na malyu — Neon vaparu chhu')
        useNeon()
    }
}

await resolveDbConnection()

new Ignitor(APP_ROOT, { importer: IMPORTER })
    .tap((app) => {
        app.booting(async () => {
            await import('#start/env')
        })
        app.listen('SIGTERM', () => app.terminate())
        app.listenIf(app.managedByPm2, 'SIGINT', () => app.terminate())
    })
    .httpServer()
    .start()
    .catch((error) => {
        process.exitCode = 1
        prettyPrintError(error)
    })