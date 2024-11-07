
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please enter your username'],
        unique: true,
        // lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
            'Please enter a valid email address'
        ],
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        match:[
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
            'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.'
        ]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
