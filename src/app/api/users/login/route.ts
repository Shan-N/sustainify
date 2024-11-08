import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

// Initialize database connection
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { password, email } = reqBody;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify password
        const validPassword = await bcryptjs.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 401 });
        }

        // Create JWT token
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

        // Create response and set cookie
        const response = NextResponse.json({
            message: "User logged in successfully",
            success: true,
        });

        // Set the token as an HTTP-only cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 24 * 60 * 60, // 1 day in seconds
        });

        return response;
    } catch (error: unknown) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 }
          );
    }
}
