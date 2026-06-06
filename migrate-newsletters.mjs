import 'dotenv/config';
import mysql from 'mysql2/promise';

const LOCAL_DB = 'mysql://root:Aeman@1234@localhost:3306/rta_newsletter';
const RAILWAY_DB = 'mysql://root:igIQbNREuuenqKZupvjEDcUqwVUnnRXj@kodama.proxy.rlwy.net:19518/railway';

const local = await mysql.createConnection(LOCAL_DB);
const railway = await mysql.createConnection(RAILWAY_DB + '?charset=utf8mb4');

await railway.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");

const [rows] = await local.execute('SELECT * FROM newsletters');
console.log(`Found ${rows.length} newsletters locally`);

await railway.execute('DELETE FROM newsletters');

for (const row of rows) {
    await railway.execute(
        `INSERT INTO newsletters (id, titleEn, titleAr, contentEn, contentAr, issueNumber, publishDate, published, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.titleEn, row.titleAr, row.contentEn, row.contentAr, row.issueNumber, row.publishDate, row.published, row.createdAt]
    );
    console.log(`✓ ${row.titleEn}`);
}

await local.end();
await railway.end();
console.log('✅ Migration complete!');