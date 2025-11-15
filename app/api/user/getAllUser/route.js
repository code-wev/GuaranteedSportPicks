import User from "@/models/user.model"
import { NextResponse } from "next/server"

export const GET = async(req)=>{
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