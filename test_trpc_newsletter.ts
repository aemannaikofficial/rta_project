import 'dotenv/config';
import { appRouter } from './server/routers';
import { getDb } from './server/db';
async function test() {
  const db = await getDb();
  const caller = appRouter.createCaller({ user: { id: 1, role: 'admin' } } as any);
  
  // First, fetch the current newsletters
  let list = await caller.newsletters.adminList();
  if (list.length === 0) {
    console.log("No newsletters found, creating one...");
    await caller.newsletters.create({
      titleEn: "Test", titleAr: "Test", contentEn: "Test", contentAr: "Test"
    });
    list = await caller.newsletters.adminList();
  }
  const idToUpdate = list[0].id;
  
  console.log(`Updating newsletter ${idToUpdate}`);
  await caller.newsletters.update({
    id: idToUpdate,
    imageUrl: 'http://example.com/test-newsletter.png'
  });
  
  list = await caller.newsletters.adminList();
  console.log("After update:");
  console.log(list.find(n => n.id === idToUpdate));
}
test().catch(console.error);
