import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { studentId, assignmentId, fileUrl } = await req.json();

    if (!studentId || !assignmentId || !fileUrl) {
      return new Response(JSON.stringify({ message: "Missing required fields" }), { status: 400 });
    }

    const submission = await prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        fileUrl,
        submittedAt: new Date(),
      },
    });

    return new Response(JSON.stringify({ message: "Submission created", submission }), { status: 201 });
  } catch (error) {
    console.error("Error creating submission:", error);
    return new Response(JSON.stringify({ message: "Failed to create submission" }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
