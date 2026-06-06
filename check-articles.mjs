import { createConnection } from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);
const [rows] = await conn.execute('SELECT id, titleEn, imageUrl FROM articles ORDER BY id');
for (const r of rows) {
  console.log(`ID: ${r.id} | Title: ${r.titleEn} | Image: ${r.imageUrl || 'NONE'}`);
}
await conn.end();
