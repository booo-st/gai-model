import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('category_id')

  if (!categoryId) {
    return NextResponse.json({ error: 'category_id required' }, { status: 400 })
  }

  try {
    const { rows } = await query(
      `SELECT pt.id, pt.category_id, pt.model_id, pt.before_video_s3_key, pt.after_video_s3_key, pt.sort_order,
              m.name, m.slug,
              ca.s3_key as thumbnail_key
       FROM preview_transformations pt
       JOIN models m ON pt.model_id = m.id
       LEFT JOIN model_assets ca ON ca.model_id = m.id AND ca.type = 'cover'
       WHERE pt.category_id = $1
       ORDER BY pt.sort_order ASC`,
      [categoryId]
    )
    return NextResponse.json(rows)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
