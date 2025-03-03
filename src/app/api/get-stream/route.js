import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return new Response(JSON.stringify({ message: "Class ID is required" }), { status: 400 });
    }

    // ✅ Fetch all stream items, including assignments
    const streamItems = await prisma.stream.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        fileUrl: true,
        assignmentId: true, // ✅ Make sure assignmentId is included
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(streamItems), { status: 200 });
  } catch (error) {
    console.error("Error fetching stream items:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch stream" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
