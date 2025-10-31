const { PrismaClient, TransactionStatus } = require("@prisma/client");
const prisma = new PrismaClient();

// --- 1. Define Your Data ---

const userData = {
  id: "u_123",
  name: "Alex Doe",
  email: "alex@doe.com", // Added email to satisfy schema
};

const categoriesData = [
  {
    id: "c_wellness",
    name: "Wellness",
    annualBudget: 60000,
    remaining: 45000, // This will go into the Balance model
  },
  {
    id: "c_commuter",
    name: "Commuter",
    annualBudget: 120000,
    remaining: 100000, // This will go into the Balance model
  },
  {
    id: "c_wfh",
    name: "Work From Home",
    annualBudget: 50000,
    remaining: 20000, // This will go into the Balance model
  },
];

const merchantsData = [
  {
    id: "m_1",
    name: "Peloton",
  },
  {
    id: "m_2",
    name: "NYC Subway",
  },
  {
    id: "m_3",
    name: "Amazon",
  },
];

const transactionsData = [
  {
    id: "t_1",
    date: "2025-08-01",
    merchantId: "m_1",
    amount: 15000,
    categoryId: "c_wellness",
    status: "Pending",
    description: "Peloton Monthly Subscription", // Added description
  },
  {
    id: "t_2",
    date: "2025-08-03",
    merchantId: "m_2",
    amount: 275,
    categoryId: "c_commuter",
    status: "Pending",
    description: "MetroCard Refill", // Added description
  },
  {
    id: "t_3",
    date: "2025-08-10",
    merchantId: "m_3",
    amount: 12000,
    categoryId: "c_wfh",
    status: "Pending",
    description: "New Desk Chair", // Added description
  },
];

// --- 2. Seed Function ---

async function main() {
  console.log("🚀 Starting seed...");

  // --- Clean the database ---
  console.log("🧹 Cleaning old data...");
  await prisma.transaction.deleteMany();
  await prisma.balance.deleteMany();
  await prisma.merchant.deleteMany();
  await prisma.benefitCategory.deleteMany();
  await prisma.user.deleteMany();

  // --- Seed User ---
  console.log("👤 Creating user...");
  await prisma.user.create({
    data: userData,
  });

  // --- Seed Merchants ---
  console.log("🏪 Creating merchants...");
  await prisma.merchant.createMany({
    data: merchantsData.map((m) => ({
      id: m.id,
      name: m.name,
    })),
  });

  // --- Seed Benefit Categories ---
  console.log("📊 Creating benefit categories...");
  await prisma.benefitCategory.createMany({
    data: categoriesData.map((c) => ({
      id: c.id,
      name: c.name,
      annualBalance: c.annualBudget, // Map 'annualBudget' to 'annualBalance'
    })),
  });

  // --- Seed Balances ---
  // This connects the user to their benefit categories and sets their remaining balance
  console.log("💰 Creating user balances...");
  await prisma.balance.createMany({
    data: categoriesData.map((c) => ({
      userId: userData.id,
      benefitCategoryId: c.id,
      remainingBalance: c.remaining, // Use 'remaining' for the balance
    })),
  });

  // --- Seed Transactions ---
  console.log("🧾 Creating transactions...");
  await prisma.transaction.createMany({
    data: transactionsData.map((t) => ({
      id: t.id,
      date: new Date(t.date), // Convert string to Date
      merchantId: t.merchantId,
      amount: t.amount,
      benefitCategoryId: t.categoryId, // Map 'categoryId'
      userId: userData.id, // All transactions belong to our one user
      description: t.description,
      status: TransactionStatus.PENDING, // Use the enum
    })),
  });

  console.log(`✅ Seed complete.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });