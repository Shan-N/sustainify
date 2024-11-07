import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const {username, password, email} = reqBody;
        if (!username || !password || !email) {
            return NextResponse.json({ message: "All fields are required" }, {status:400});
        }
        const user = await User.findOne({username: username, email: email});
        if (user) {
            return NextResponse.json({ message: "User already exists" }, {status:409});
        }
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

       const newUser =  new User({
            username,
            password: hashedPassword,
            email
        });
        await newUser.save();
        return NextResponse.json({ message: "User created successfully!" }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, {status:500});
    }
        
}