import { defineConfig, loadEnv, type Plugin, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { Pool } from 'pg'

function localEventsApi(databaseUrl: string): Plugin {
  const pool = new Pool({
    connectionString: databaseUrl,
    max: 5,
    ssl: { rejectUnauthorized: false },
  })

  return {
    name: 'local-events-api',
    configureServer(server) {
      server.middlewares.use('/api/events', async (req, res) => {
        try {
          if (req.method === 'GET') {
            const result = await pool.query(
              'SELECT id, title, event_date, official, attendees, created_at FROM faxing_events ORDER BY event_date DESC',
            )
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result.rows))
            return
          }

          if (req.method === 'POST') {
            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(Buffer.from(chunk))
            const body = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
            const { id, title, eventDate, official, attendees } = body
            if (
              typeof id !== 'string' ||
              typeof title !== 'string' ||
              !Number.isFinite(Number(eventDate)) ||
              typeof official !== 'boolean' ||
              !Array.isArray(attendees)
            ) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid event payload' }))
              return
            }

            const result = await pool.query(
              `INSERT INTO faxing_events (id, title, event_date, official, attendees)
               VALUES ($1, $2, $3, $4, $5::jsonb)
               RETURNING id, title, event_date, official, attendees, created_at`,
              [id, title.trim().slice(0, 160), new Date(Number(eventDate)), official, JSON.stringify(attendees)],
            )
            res.statusCode = 201
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(result.rows[0]))
            return
          }

          res.statusCode = 405
          res.setHeader('Allow', 'GET, POST')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
        } catch (error) {
          console.error('[v0] Local events API error:', error)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Unable to access events' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')
  const databaseUrl = env.DATABASE_URL || process.env.DATABASE_URL

  return {
    plugins: [react(), localEventsApi(databaseUrl)],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  }
})
