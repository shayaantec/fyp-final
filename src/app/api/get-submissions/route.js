import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const studentId = searchParams.get('studentId');

    if (!courseId || !studentId) {
      return new Response(
        JSON.stringify({ message: 'Missing courseId or studentId' }),
        { status: 400 }
      );
    }

    const submissions = await prisma.submission.findMany({
      where: {
        studentId: parseInt(studentId), // Ensure you're filtering by the correct student
        assignment: {
          classId: parseInt(courseId), // Make sure you're using the correct courseId
        },
      },
      select: {
        assignment: true,  // Get assignment details
        fileUrl: true,     // Get file URL
        submittedAt: true, // Get submission timestamp
      },
    });
    

    return new Response(JSON.stringify(submissions), { status: 200 });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to fetch submissions' }),
      { status: 500 }
    );
  }
}
