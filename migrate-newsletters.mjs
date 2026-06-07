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
        `INSERT INTO newsletters (id, titleEn, titleAr, contentEn, contentAr, issueNumber, publishDate, published, createdAt, editionNumber, sectionNumber) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [row.id, row.titleEn, row.titleAr, row.contentEn, row.contentAr, row.issueNumber, row.publishDate, row.published, row.createdAt, row.editionNumber, row.sectionNumber]
    );
    console.log(`✓ ${row.titleEn}`);
}

console.log('✅ Migration complete!');

const [ed1] = await railway.execute('SELECT id FROM newsletters WHERE editionNumber = 1 ORDER BY id');
for (let i = 0; i < ed1.length; i++) {
    await railway.execute('UPDATE newsletters SET sectionNumber = ? WHERE id = ?', [i + 1, ed1[i].id]);
    console.log(`Edition 1 / Section ${i + 1}`);
}

const [ed2] = await railway.execute('SELECT id FROM newsletters WHERE editionNumber = 2 ORDER BY id');
for (let i = 0; i < ed2.length; i++) {
    await railway.execute('UPDATE newsletters SET sectionNumber = ? WHERE id = ?', [i + 11, ed2[i].id]);
    console.log(`Edition 2 / Section ${i + 11}`);
}

console.log('✅ Numbering fixed!');

await local.end();
await railway.end();