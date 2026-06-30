import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin
if (getApps().length === 0) {
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully.');
    } else {
      console.warn('FIREBASE_SERVICE_ACCOUNT environment variable is missing. Database calls will fail.');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

const db = getApps().length ? getFirestore() : null;

// Helper to check if DB is initialized
function getDb() {
  if (!db) {
    throw new Error('Database is offline. Please configure FIREBASE_SERVICE_ACCOUNT in your .env file.');
  }
  return db;
}

// Keep a compatible query helper for simple startup checks (like page.tsx)
export async function query(text: string, params?: any[]) {
  const database = getDb();
  if (text.includes('COUNT(*) as count FROM brands')) {
    const snapshot = await database.collection('brands').count().get();
    return { rows: [{ count: snapshot.data().count }] };
  }
  throw new Error(`Legacy direct query execution is deprecated. Please use the typed repository methods. Query: ${text}`);
}

export async function getBrand(slug: string) {
  const database = getDb();
  const snapshot = await database.collection('brands').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() };
}

export async function updateBrand(slug: string, data: any) {
  const database = getDb();
  const snapshot = await database.collection('brands').where('slug', '==', slug).limit(1).get();
  if (snapshot.empty) {
    throw new Error(`Brand with slug ${slug} not found`);
  }
  const docRef = snapshot.docs[0].ref;
  const updateData: any = {
    updated_at: FieldValue.serverTimestamp()
  };
  
  if (data.name !== undefined) updateData.name = data.name;
  if (data.industry !== undefined) updateData.industry = data.industry;
  if (data.toneOfVoice !== undefined) updateData.tone_of_voice = data.toneOfVoice;
  if (data.tone_of_voice !== undefined) updateData.tone_of_voice = data.tone_of_voice;
  if (data.markets !== undefined) updateData.markets = data.markets;
  if (data.platforms !== undefined) updateData.platforms = data.platforms;
  if (data.contentVerticals !== undefined) updateData.content_verticals = data.contentVerticals;
  if (data.content_verticals !== undefined) updateData.content_verticals = data.content_verticals;
  if (data.brandColors !== undefined) updateData.brand_colors = data.brandColors;
  if (data.brand_colors !== undefined) updateData.brand_colors = data.brand_colors;
  if (data.brandFonts !== undefined) updateData.brand_fonts = data.brandFonts;
  if (data.brand_fonts !== undefined) updateData.brand_fonts = data.brand_fonts;

  await docRef.update(updateData);
  const updatedDoc = await docRef.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function getAllBrands() {
  const database = getDb();
  const snapshot = await database.collection('brands').orderBy('created_at', 'desc').get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getCampaigns(brandId: string | number) {
  const database = getDb();
  const snapshot = await database.collection('campaigns')
    .where('brand_id', '==', String(brandId))
    .orderBy('start_date', 'desc')
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getContentPieces(brandId: string | number, limit = 50) {
  const database = getDb();
  const snapshot = await database.collection('content_pieces')
    .where('brand_id', '==', String(brandId))
    .orderBy('created_at', 'desc')
    .limit(limit)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getCalendarEvents(brandId: string | number, year: number) {
  const database = getDb();
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  const snapshot = await database.collection('calendar_events')
    .where('brand_id', '==', String(brandId))
    .where('event_date', '>=', startDate)
    .where('event_date', '<=', endDate)
    .orderBy('event_date')
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function createBrand(data: any) {
  const database = getDb();
  const ref = database.collection('brands').doc();
  const brandData = {
    slug: data.slug,
    name: data.name,
    industry: data.industry,
    tone_of_voice: data.toneOfVoice || '',
    markets: data.markets || [],
    platforms: data.platforms || [],
    content_verticals: data.contentVerticals || [],
    brand_colors: data.brandColors || {},
    brand_fonts: data.brandFonts || {},
    created_at: FieldValue.serverTimestamp()
  };
  await ref.set(brandData);
  return { id: ref.id, ...brandData };
}

export async function createContentPiece(data: any) {
  const database = getDb();
  const ref = database.collection('content_pieces').doc();
  const pieceData = {
    brand_id: String(data.brandId || 1),
    campaign_id: data.campaignId ? String(data.campaignId) : null,
    platform: data.platform || '',
    content_type: data.contentType || '',
    content_vertical: data.contentVertical || '',
    title: data.title || '',
    caption: data.caption || '',
    status: data.status || 'planned',
    scheduled_date: data.scheduled_date || data.scheduledDate || '',
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp()
  };
  await ref.set(pieceData);
  return { id: ref.id, ...pieceData };
}

export async function createCampaign(data: any) {
  const database = getDb();
  const ref = database.collection('campaigns').doc();
  const campaignData = {
    brand_id: String(data.brandId || 1),
    name: data.name || '',
    description: data.description || '',
    start_date: data.startDate || '',
    end_date: data.endDate || '',
    status: data.status || 'active',
    created_at: FieldValue.serverTimestamp()
  };
  await ref.set(campaignData);
  return { id: ref.id, ...campaignData };
}

export async function getContentPiece(id: string) {
  const database = getDb();
  const doc = await database.collection('content_pieces').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

export async function updateContentPiece(id: string, data: any) {
  const database = getDb();
  const ref = database.collection('content_pieces').doc(id);
  const cleanData: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanData[key] = value;
    }
  }
  cleanData.updated_at = FieldValue.serverTimestamp();
  await ref.update(cleanData);
  const updatedDoc = await ref.get();
  return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function createCalendarEvent(data: any) {
  const database = getDb();
  const ref = database.collection('calendar_events').doc();
  const eventData = {
    brand_id: String(data.brandId || 1),
    title: data.title || '',
    event_date: data.event_date || '',
    event_type: data.event_type || 'campaign',
    effort_level: data.effort_level || 'medium',
    created_at: FieldValue.serverTimestamp()
  };
  await ref.set(eventData);
  return { id: ref.id, ...eventData };
}

export async function createBrandMemory(brandId: string | number, data: any) {
  const database = getDb();
  const ref = database.collection('brand_memories').doc();
  const memoryData = {
    brand_id: String(brandId || 1),
    title: data.title || '',
    content: data.content || '',
    category: data.category || 'strategy',
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp()
  };
  await ref.set(memoryData);
  return { id: ref.id, ...memoryData };
}

export async function getBrandMemories(brandId: string | number) {
  const database = getDb();
  const snapshot = await database.collection('brand_memories')
    .where('brand_id', '==', String(brandId))
    .orderBy('created_at', 'desc')
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getContentPiecesByDate(brandId: string | number, dateStr: string) {
  const database = getDb();
  const snapshot = await database.collection('content_pieces')
    .where('brand_id', '==', String(brandId))
    .where('scheduled_date', '==', dateStr)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}

export async function getCalendarEventsByDate(brandId: string | number, dateStr: string) {
  const database = getDb();
  const snapshot = await database.collection('calendar_events')
    .where('brand_id', '==', String(brandId))
    .where('event_date', '==', dateStr)
    .get();
  return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
}
