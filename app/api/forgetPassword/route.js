import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server"
import User from "../user/UserModel";
import OtpModel from "../otp/OtpModel";
import { forgetPassword } from "./ForgetPasswordController";

export const PUT = async(req)=>{
    await dbConnect();
    try {
        const data = await req.json();
        const {email, otp, newPassword} = data;
        const isExist = await User.findOne({email:email});
        if(!isExist){
            return NextResponse.json({
                message:"User Not Found"
            }, {status:401})
        }

        const otpExist = await OtpModel.findOne({email:email});
        console.log(otp, "Tomi to otp Exist kaka")
        if(!otpExist){
            return NextResponse.json({
                message:"OTP not available on databse — maybe expired or not sent."
            }, {status:401})
        }
        if(otp != otpExist.otp){
            return NextResponse.json({
                message:"Otp Not Matched! Plese sent valid otp"
            }, {status:401})
        }

       const updated =  await forgetPassword(email, newPassword);
       return NextResponse.json({
        message:"Success",
        data:updated

       })
        
    } catch (error) {
        return NextResponse.json({
            error,
            message:error?.message
        })
    }
}