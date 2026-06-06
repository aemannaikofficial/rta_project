import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const conn = await mysql.createConnection(process.env.DATABASE_URL);
  
  // Get current content
  const [rows] = await conn.execute('SELECT contentEn, contentAr FROM articles WHERE id = 20001');
  let contentEn = rows[0].contentEn;
  let contentAr = rows[0].contentAr;

  // === FIX ENGLISH CONTENT ===
  
  // 1. Replace em dashes with proper punctuation
  // "technology—it" -> "technology; it"
  contentEn = contentEn.replace('a supporting technology—it is becoming', 'a supporting technology; it is becoming');
  // "measurable outcomes—such as" -> "measurable outcomes, such as"
  contentEn = contentEn.replace('measurable outcomes—such as', 'measurable outcomes, such as');
  // "experience—signals" -> "experience, signals"
  contentEn = contentEn.replace('experience—signals', 'experience, signals');
  
  // 2. Fix bullet points: convert inline bullets to newline-separated bullets
  // The bullet section starts with "three priority directions can further enhance impact:\n"
  // and has bullets as "• text. • text. • text."
  // We need them as separate lines: "• text.\n• text.\n• text."
  // Actually they are already on separate lines in the DB. The issue is the rendering.
  // Let me check if they need HTML line breaks or if the component handles newlines.
  // Looking at the content, the bullets ARE on separate lines already.
  // The issue is likely in how the article detail page renders them.
  // But the user says they appear inline, so let's check if there's a rendering issue.
  
  // Actually, looking at the raw content, the bullets are separated by \n already.
  // The issue might be that the article renderer doesn't convert \n to <br> or paragraphs.
  // Let's keep the content fix and also check the renderer.
  
  // === FIX ARABIC CONTENT ===
  
  // 1. Replace em dashes in Arabic
  // "القابلة للقياس — مثل" -> "القابلة للقياس، مثل"
  contentAr = contentAr.replace('القابلة للقياس — مثل', 'القابلة للقياس، مثل');
  // "المتعاملين — إلى" -> "المتعاملين، إلى"  
  contentAr = contentAr.replace('المتعاملين — إلى', 'المتعاملين، إلى');
  
  // Check for any remaining em dashes
  const enDashes = (contentEn.match(/—/g) || []).length;
  const arDashes = (contentAr.match(/—/g) || []).length;
  console.log(`Remaining em dashes in EN: ${enDashes}`);
  console.log(`Remaining em dashes in AR: ${arDashes}`);
  
  // Update the database
  await conn.execute('UPDATE articles SET contentEn = ?, contentAr = ? WHERE id = 20001', [contentEn, contentAr]);
  console.log('Article content updated successfully');
  
  // Verify
  const [verify] = await conn.execute('SELECT contentEn, contentAr FROM articles WHERE id = 20001');
  const verifyEn = verify[0].contentEn;
  const verifyAr = verify[0].contentAr;
  console.log(`\nVerification - EN em dashes remaining: ${(verifyEn.match(/—/g) || []).length}`);
  console.log(`Verification - AR em dashes remaining: ${(verifyAr.match(/—/g) || []).length}`);
  
  // Show the bullet point section
  const bulletSection = verifyEn.split('three priority directions can further enhance impact:')[1]?.split('To maintain')[0];
  console.log('\nBullet section in EN:');
  console.log(JSON.stringify(bulletSection));
  
  await conn.end();
}

main().catch(e => { console.error(e); process.exit(1); });
