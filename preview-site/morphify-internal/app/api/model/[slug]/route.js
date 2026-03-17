import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request, { params }) {
  const { slug } = await params
  try {
    const { rows } = await query(
      `SELECT m.id, m.name, m.slug, m.category,
              a.id as asset_id, a.type, a.s3_key, a.sort_order as asset_order
       FROM models m
       JOIN model_assets a ON a.model_id = m.id
       WHERE m.slug = $1
       ORDER BY a.type, a.sort_order ASC`,
      [slug]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const model = {
      id: rows[0].id,
      name: rows[0].name,
      slug: rows[0].slug,
      category: rows[0].category,
    }

    const assets = rows.map((r) => ({
      id: r.asset_id,
      type: r.type,
      s3_key: r.s3_key,
      sort_order: r.asset_order,
    }))

    return NextResponse.json({ model, assets })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
