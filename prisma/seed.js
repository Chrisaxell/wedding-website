// Prisma seed script to populate initial invite records
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const invites = [
    { id: '0d44434f-e193-49ea-bdc2-3d3f6deab3ab', guestName: 'Chris', language: 'en' },
    { id: '3663d23a-771b-44c8-b41a-a6ebea727427', guestName: 'Scarlett', language: 'ko' },
    { id: 'f8234976-a9a7-4d86-a02f-9539c0307d33', guestName: 'Vikors', language: 'no' },
  ];

  for (const data of invites) {
    await prisma.invite.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${invites.length} invites`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
