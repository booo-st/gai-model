import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const { rows } = await query(
      'SELECT * FROM preview_categories ORDER BY display_order ASC'
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
