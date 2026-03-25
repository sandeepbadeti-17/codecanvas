// import { prisma } from "./generated/prisma"; // adjust path
import { prisma } from "./prisma"; // adjust path

async function main() {
  const users = await prisma.user.findMany();
  console.log(users, "users");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });