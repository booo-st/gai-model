import { query } from '@/lib/db'
import ModelGrid from '@/components/ModelGrid'

export const dynamic = 'force-dynamic'

export default async function AsianPage() {
  const { rows } = await query(
    `SELECT m.id, m.name, m.slug, m.category, a.s3_key as cover_key
     FROM models m
     LEFT JOIN model_assets a ON a.model_id = m.id AND a.type = 'cover'
     WHERE m.is_active = true AND m.category = $1
     ORDER BY m.sort_order ASC, m.name ASC`,
    ['asian']
  )
  return <ModelGrid models={rows} title="Asian" />
}
