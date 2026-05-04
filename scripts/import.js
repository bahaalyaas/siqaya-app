const fs = require("fs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
const file = fs.readFileSync("data.csv", "utf-8");
const rows = file.split("\n");

for (let i = 1; i < rows.length; i++) {
const row = rows[i].split(",");


if (!row[0]) continue;

const regionName = row[0].trim();
const regionCode = row[1].trim();
const mosqueName = row[2].trim();
const mosqueCode = row[3].trim();

const region = await prisma.region.upsert({
  where: { code: regionCode },
  update: {},
  create: {
    name: regionName,
    code: regionCode,
  },
});

await prisma.mosque.upsert({
  where: { code: mosqueCode },
  update: {},
  create: {
    name: mosqueName,
    code: mosqueCode,
    regionId: region.id,
  },
});


}

console.log("تم إدخال البيانات بنجاح");
}

main();
