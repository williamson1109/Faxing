import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5, ssl: { rejectUnauthorized: false } })
const FAXEPAVE_PASSWORD = 'jegElskerFaxe!jAA'
const isAdmin = (req: VercelRequest) => req.headers['x-faxepave-password'] === FAXEPAVE_PASSWORD
const columns = 'id, title, event_date, official, attendees, created_at'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const id = typeof req.query.id === 'string' ? req.query.id : undefined
    if (req.method === 'GET' && !id) {
      const result = await pool.query(`SELECT ${columns} FROM faxing_events ORDER BY event_date DESC`)
      return res.status(200).json(result.rows)
    }
    if ((req.method === 'PUT' || req.method === 'DELETE') && !isAdmin(req)) return res.status(401).json({ error: 'Faxepave login required' })
    if (!id) return res.status(400).json({ error: 'Event id is required' })
    if (req.method === 'PUT') {
      const { title, eventDate, official, attendees } = req.body ?? {}
      if (typeof title !== 'string' || !Number.isFinite(Number(eventDate)) || typeof official !== 'boolean' || !Array.isArray(attendees)) return res.status(400).json({ error: 'Invalid event payload' })
      const result = await pool.query(`UPDATE faxing_events SET title = $1, event_date = $2, official = $3, attendees = $4::jsonb WHERE id = $5 RETURNING ${columns}`, [title.trim().slice(0, 160), new Date(Number(eventDate)), official, JSON.stringify(attendees), id])
      if (!result.rowCount) return res.status(404).json({ error: 'Event not found' })
      return res.status(200).json(result.rows[0])
    }
    if (req.method === 'DELETE') {
      const result = await pool.query('DELETE FROM faxing_events WHERE id = $1', [id])
      if (!result.rowCount) return res.status(404).json({ error: 'Event not found' })
      return res.status(204).end()
    }
    if (req.method === 'POST') {
      const { id: eventId, title, eventDate, official, attendees } = req.body ?? {}
      if (typeof eventId !== 'string' || typeof title !== 'string' || !Number.isFinite(Number(eventDate)) || typeof official !== 'boolean' || !Array.isArray(attendees)) return res.status(400).json({ error: 'Invalid event payload' })
      const result = await pool.query(`INSERT INTO faxing_events (id, title, event_date, official, attendees) VALUES ($1, $2, $3, $4, $5::jsonb) RETURNING ${columns}`, [eventId, title.trim().slice(0, 160), new Date(Number(eventDate)), official, JSON.stringify(attendees)])
      return res.status(201).json(result.rows[0])
    }
    res.setHeader('Allow', 'GET, POST, PUT, DELETE')
    return res.status(405).json({ error: 'Method not allowed' })
  } catch (error) { console.error('[v0] Events API error:', error); return res.status(500).json({ error: 'Unable to access events' }) }
}
