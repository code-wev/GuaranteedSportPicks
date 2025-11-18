import { NextResponse } from "next/server"
import { sendOtp } from "../otpController";
import { dbConnect } from "@/lib/dbConnect";

export const POST = async(req)=>{
    await dbConnect();
    try {

        const data = await req.json();
        const {email} = data;
        const sendEmail = await sendOtp(email);
        return NextResponse.json({
            message:"Success",
            data:sendEmail

        })

        
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        })
    }
}