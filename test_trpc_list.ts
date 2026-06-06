import 'dotenv/config';
import { appRouter } from './server/routers';
import { getDb } from './server/db';
async function test() {
  const db = await getDb();
  const caller = appRouter.createCaller({ user: { id: 1, role: 'admin' } } as any);
  
  const list = await caller.newsletters.adminList();
  console.log("Current newsletters in DB:");
  list.forEach(n => {
    console.log(`ID: ${n.id}, imageUrl: ${n.imageUrl}`);
  });
}
test().catch(console.error);
