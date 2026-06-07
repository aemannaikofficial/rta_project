const fs = require('fs');
let c = fs.readFileSync('client/src/pages/Editions.tsx', 'utf8');
const o = "const forewordEn = firstNewsletter?.contentEn || \"\";\n                const forewordAr = firstNewsletter?.contentAr || \"\";";
const n = `const rawEn = firstNewsletter?.contentEn || "";
                const rawAr = firstNewsletter?.contentAr || "";
                const stripHtml = s => s.replace(/<[^>]*>/g, '').trim();
                const parsePreview = s => { try { const j = JSON.parse(s); return j.body?.[0]?.en || ""; } catch { return stripHtml(s); } };
                const forewordEn = parsePreview(rawEn);
                const forewordAr = parsePreview(rawAr);`;
if (c.includes(o)) {
  fs.writeFileSync('client/src/pages/Editions.tsx', c.replace(o, n), 'utf8');
  console.log('Done!');
} else {
  console.log('Pattern not found');
}
