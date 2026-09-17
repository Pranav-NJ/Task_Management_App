const { initDb } = require('../config/db');

async function seed() {
  console.log('🌱 Starting Database Initialization and Seeding process...');
  await initDb();
  console.log(' Database Initialization and Seeding finished.');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
