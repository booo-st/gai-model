import { query } from '@/lib/db'
import ModelGrid from '@/components/ModelGrid'

export const dynamic = 'force-dynamic'

async function getModels(category) {
  const { rows } = await query(
    `SELECT m.id, m.name, m.slug, m.category, a.s3_key as cover_key
     FROM models m
     LEFT JOIN model_assets a ON a.model_id = m.id AND a.type = 'cover'
     WHERE m.is_active = true AND ($1::text IS NULL OR m.category = $1)
     ORDER BY m.sort_order ASC, m.name ASC`,
    [category ?? null]
  )
  return rows
}

export default async function AllPage() {
  const models = await getModels(null)
  return <ModelGrid models={models} title="All" />
}
