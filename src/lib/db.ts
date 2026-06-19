import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:oJR1ojwYYGlm608LZ3JO64XdKpzOlLEByxg2GOpFVAX0HXH2UcEB3cVhUl6Iluff@10.0.1.8:5432/tact',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function getBrand(slug: string) {
  const result = await query('SELECT * FROM brands WHERE slug = $1', [slug]);
  return result.rows[0] || null;
}

export async function getAllBrands() {
  const result = await query('SELECT * FROM brands ORDER BY created_at DESC');
  return result.rows;
}

export async function getCampaigns(brandId: number) {
  const result = await query(
    'SELECT * FROM campaigns WHERE brand_id = $1 ORDER BY start_date DESC',
    [brandId]
  );
  return result.rows;
}

export async function getContentPieces(brandId: number, limit = 50) {
  const result = await query(
    'SELECT * FROM content_pieces WHERE brand_id = $1 ORDER BY created_at DESC LIMIT $2',
    [brandId, limit]
  );
  return result.rows;
}

export async function getCalendarEvents(brandId: number, year: number) {
  const result = await query(
    `SELECT * FROM calendar_events 
     WHERE brand_id = $1 
     AND EXTRACT(YEAR FROM event_date) = $2 
     ORDER BY event_date`,
    [brandId, year]
  );
  return result.rows;
}

export async function createBrand(data: any) {
  const result = await query(
    `INSERT INTO brands (slug, name, industry, tone_of_voice, markets, platforms, content_verticals, brand_colors, brand_fonts)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      data.slug, data.name, data.industry, data.toneOfVoice,
      data.markets, JSON.stringify(data.platforms),
      data.contentVerticals, JSON.stringify(data.brandColors || {}),
      JSON.stringify(data.brandFonts || {})
    ]
  );
  return result.rows[0];
}

export async function createContentPiece(data: any) {
  const result = await query(
    `INSERT INTO content_pieces (brand_id, campaign_id, platform, content_type, content_vertical, title, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'planned') RETURNING *`,
    [data.brandId, data.campaignId, data.platform, data.contentType, data.contentVertical, data.title]
  );
  return result.rows[0];
}

export async function updateContentPiece(id: number, data: any) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      fields.push(`${key} = $${idx}`);
      values.push(value);
      idx++;
    }
  }
  
  if (fields.length === 0) return null;
  
  values.push(id);
  const result = await query(
    `UPDATE content_pieces SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`,
    values
  );
  return result.rows[0];
}
