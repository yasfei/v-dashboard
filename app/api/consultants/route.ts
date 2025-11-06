import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const consultants = await prisma.user.findMany({
    where: { role: "CONSULTANT" },
    select: { id: true, name: true },
  });
  return new Response(JSON.stringify(consultants), {
    headers: { "Content-Type": "application/json" },
  });
}
