import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Parse the URL parameters
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("courseId");

    if (!classId) {
      return new Response(
        JSON.stringify({ message: 'Class ID is required' }),
        { status: 400 }
      );
    }

    // Fetch assignments related to the courseId
    const assignments = await prisma.assignment.findMany({
      where: { classId: parseInt(classId) },
      orderBy: { dueDate: 'asc' },  // You can adjust the sorting criteria based on your needs
      select: {
        id: true,
        title: true,
        description: true,
        dueDate: true,
        fileUrl: true, // Assuming the file URL is stored in the fileUrl field
      },
    });

    if (assignments.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No assignments found for this course' }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(assignments), { status: 200 });
  } catch (error) {
    // Log the error in a way that avoids invalid argument types
    console.error("Error occurred while fetching assignments:", error instanceof Error ? error.message : error);

    return new Response(
      JSON.stringify({ message: 'Failed to fetch assignments', error: error.message || error }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}