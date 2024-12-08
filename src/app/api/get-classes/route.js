import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    // Parse the URL parameters
    const { searchParams } = new URL(req.url);
    const teacherId = searchParams.get("teacherId");
    const courseId = searchParams.get("courseId");

    if (courseId) {
      // Fetch a specific class by courseId
      const course = await prisma.class.findUnique({
        where: { id: parseInt(courseId) },
        include: {
          announcements: true, // Include announcements related to the class
          activities: true, // Include activities related to the class
          enrollments: {
            include: { student: { select: { id: true, firstName: true, lastName: true, email: true } } }, // Include student details for enrollments
          },
        },
      });

      if (!course) {
        console.log("Class not found for courseId:", courseId);
        return new Response(
          JSON.stringify({ message: "Class not found" }),
          { status: 404 }
        );
      }

      return new Response(JSON.stringify(course), { status: 200 });
    }
    if (!teacherId) {
      return new Response(
        JSON.stringify({ message: 'Teacher ID is required' }),
        { status: 400 }
      );
    }

    const classes = await prisma.class.findMany({
      where: { teacherId: parseInt(teacherId) },
      orderBy: { createdAt: 'desc' },
    });

    return new Response(JSON.stringify({ classes }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ message: 'Failed to fetch classes' }), { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

