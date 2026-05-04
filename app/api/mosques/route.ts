export const dynamic = "force-dynamic";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
try {
const mosques = await prisma.mosque.findMany({
include: {
region: true,
},
});


return Response.json(mosques);


} catch (error) {
console.error("MOSQUES ERROR:", error);


// 🔥 هذا أهم شيء يمنع فشل build
return Response.json([]);


}
}
