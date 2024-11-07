import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken"
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { password, email } = reqBody;

        const user = await User.findOne({ email: email });
        if(!user) {
            return NextResponse.json({ message: "User not found" }, { status:404 });
        }
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status:401 });
        }
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        }
        const token = jwt.sign(tokenData, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "User logged in successfully",
            success:true,
        });
        return response;
        response.cookies.set("token", token, {
            httpOnly: true,
        });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status:500 });
    }
}