import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      return new Response(JSON.stringify({ message: "Invalid content type. Expected JSON." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { title, description, dueDate, classId, fileUrl } = await req.json();

    if (!title || !dueDate || !classId || !fileUrl) {
      return new Response(JSON.stringify({ message: "All required fields must be filled." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate)) {
      return new Response(JSON.stringify({ message: "Invalid due date format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ Create the assignment
    const newAssignment = await prisma.assignment.create({
      data: {
        title,
        description: description || "",
        dueDate: parsedDueDate,
        classId,
        fileUrl: fileUrl || null,
      },
    });

    // ✅ Add the assignment to the stream so it appears immediately
    await prisma.stream.create({
      data: {
        classId,
        type: "assignment",
        title: `New Assignment: ${title}`,
        description: description || "An assignment has been created.",
        fileUrl,
        assignmentId: newAssignment.id, // Link to the assignment
      },
    });

    return new Response(
      JSON.stringify({
        message: "Assignment created successfully",
        assignment: newAssignment,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);
    return new Response(JSON.stringify({ message: "Internal server error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await prisma.$disconnect();
  }
}
