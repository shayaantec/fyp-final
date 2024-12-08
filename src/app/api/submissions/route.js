// /app/api/submission/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { studentId, assignmentId, fileUrl } = await req.json(); // Parse the incoming JSON body
    
    // Validate the required fields
    if (!studentId || !assignmentId || !fileUrl) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Get the current timestamp for 'submittedAt'
    const submittedAt = new Date().toISOString();

    // Create the submission record in the database
    const submission = await prisma.submission.create({
      data: {
        studentId,
        assignmentId,
        fileUrl,
        submittedAt,  // Add the current timestamp
      },
    });

    // Return the success response with the created submission data
    return new Response(
      JSON.stringify({ message: "Submission created", submission }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating submission:", error);
    return new Response(
      JSON.stringify({ message: "Failed to create submission" }),
      { status: 500 }
    );
  }
}
