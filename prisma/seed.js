const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Starting seed...");

  // Create a demo user
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@benepass.com",
      balance: 100,
    },
  });

  // Create an initial deposit transaction
  await prisma.transaction.create({
    data: {
      description: "Initial Deposit",
      amount: 100,
      type: "DEPOSIT",
      userId: user.id,
      originalAmount: 100,
      originalCurrency: "USD",
    },
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
