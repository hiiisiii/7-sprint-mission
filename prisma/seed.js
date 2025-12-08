// prisma/seed.js

require("dotenv/config");

const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const { PrismaClient } = require("@prisma/client");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.product.create({
    data: {
      name: "", // 예: "노트북"
      description: "", // 예: "상태 좋은 중고 노트북"
      price: 0, // 예: 700000
      tags: [], // 예: ["전자제품", "노트북"]
    },
  });

  await prisma.article.create({
    data: {
      title: "1일차 테스트 글",
      content: "내용입니다",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
