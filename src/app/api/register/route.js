import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/app/lib/prisma";
import { sendEmail } from "@/app/lib/sendEmail";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, CNIC, age, gender, role } = body;

    // Validate all required fields
    if (!firstName || !lastName || !email || !password || !CNIC || !age || !gender || !role) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    // Validate CNIC
    if (!/^[\d]{13}$/.test(CNIC)) {
      return NextResponse.json({ message: "CNIC must be 13 digits." }, { status: 400 });
    }

    // Validate age
    const numericAge = parseInt(age, 10);
    if (isNaN(numericAge) || numericAge < 18 || numericAge > 100) {
      return NextResponse.json({ message: "Age must be between 18 and 100." }, { status: 400 });
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return NextResponse.json({
        message: "Password must include at least one uppercase, lowercase, number, and special character.",
      }, { status: 400 });
    }

    // Normalize and validate role and gender
    const normalizedRole = role.toLowerCase();
    const validRoles = ["student", "teacher"];
    const validGenders = ["male", "female", "other"];

    if (!validRoles.includes(normalizedRole)) {
      return NextResponse.json({ message: "Invalid role selected." }, { status: 400 });
    }

    if (!validGenders.includes(gender.toLowerCase())) {
      return NextResponse.json({ message: "Invalid gender selected." }, { status: 400 });
    }

    // Check if email is already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 409 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 4-digit verification code
    const verificationCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user with the verification code
    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        CNIC,
        age: numericAge,
        gender: gender.toLowerCase(),
        role: normalizedRole,
        verificationCode,
        isConfirmed: false,
      },
    });

    // Send email with the verification code
    const emailHtml = `
      <h1>Verify Your Email</h1>
      <p>Thank you for registering. Please use the following 4-digit code to verify your email:</p>
      <h2>${verificationCode}</h2>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(email, "Email Verification Code", emailHtml);

    return NextResponse.json({
      message: "User registered successfully. Please check your email for the verification code.",
    }, { status: 201 });
  } catch (error) {
    console.error("Error during registration:", error);
    return NextResponse.json({ message: "An unexpected error occurred." }, { status: 500 });
  }
}
