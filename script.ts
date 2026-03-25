import { prisma } from "./lib/prisma";

async function main() {
  console.log("🌱 Seeding DevCanva auth data...");

  // Clean DB (order matters because of relations)
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create a user (same person across providers)
  const user = await prisma.user.create({
    data: {
      name: "Sandeep",
      email: "sandeep@devcanva.com",
      image: "hello",
    },
  });

  // Link Google account
  await prisma.account.create({
    data: {
      userId: user.id,
      provider: "google",
      providerAccountId: "google-123",
      access_token: "mock_google_token",
    },
  });

  // Link GitHub account (same user)
  await prisma.account.create({
    data: {
      userId: user.id,
      provider: "github",
      providerAccountId: "github-456",
      access_token: "mock_github_token",
    },
  });

  console.log("✅ Seeded user with multiple providers");

  // Fetch and log
  const users = await prisma.user.findMany({
    include: {
      accounts: true,
    },
  });

  console.log(JSON.stringify(users, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });