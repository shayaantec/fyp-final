import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { title, description, dueDate, classId, fileUrl } = await req.json();

    // Validate required fields
    if (!title || !dueDate || !classId || !fileUrl) {
      return new Response(
        JSON.stringify({ message: 'Title, due date, class ID, and fileUrl are required' }),
        { status: 400 }
      );
    }
    if (fileUrl && typeof fileUrl !== 'string') {
        return new Response(
          JSON.stringify({ message: 'Invalid file URL format' }),
          { status: 400 }
        );
      }
      
    // Parse and validate the due date
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return new Response(
        JSON.stringify({ message: 'Invalid due date format' }),
        { status: 400 }
      );
    }

    // Create a new assignment in the database
    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || '', // Optional description
        dueDate: parsedDueDate,
        classId,
        fileUrl: fileUrl || null,
      },
    });

    return new Response(
      JSON.stringify({ message: 'Assignment created successfully', assignment: newAssignment }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error saving assignment:', error);
    return new Response(
      JSON.stringify({ message: 'Failed to create assignment' }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}