
import { NextResponse } from "next/server"
import User from "../UserModel";

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