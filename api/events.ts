import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: { rejectUnauthorized: false } })

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT id, title, event_date, official, attendees, created_at FROM faxing_events ORDER BY event_date DESC',
      )
      return res.status(200).json(result.rows)
    }

    if (req.method === 'POST') {
      const { id, title, eventDate, official, attendees } = req.body ?? {}
      if (typeof id !== 'string' || typeof title !== 'string' || !Number.isFinite(Number(eventDate)) || typeof official !== 'boolean' || !Array.isArray(attendees)) {
        return res.status(400).json({ error: 'Invalid event payload' })
      }

      const result = await pool.query(
        `INSERT INTO faxing_events (id, title, event_date, official, attendees)
         VALUES ($1, $2, $3, $4, $5::jsonb)
         RETURNING id, title, event_date, official, attendees, created_at`,
        [id, title.trim().slice(0, 160), new Date(Number(eventDate)), official, JSON.stringify(attendees)],
      )
      return res.status(201).json(result.rows[0])
    }

    res.setHeader('Allow', 'GET, POST')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('[v0] Events API error:', error)
    return res.status(500).json({ error: 'Unable to access events' })
  }
}
