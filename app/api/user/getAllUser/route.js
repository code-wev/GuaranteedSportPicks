
import { NextResponse } from "next/server"
import User from "../UserModel";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async(req)=>{


    await dbConnect();
    try {

        const allUser = await User.find();
        return NextResponse.json({
            message:"Success",
            data:allUser
        })
        
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        })
    }
}