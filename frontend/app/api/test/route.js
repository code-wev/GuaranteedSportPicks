import { dbConnect } from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export const GET = async(req)=>{


    await dbConnect();
    try {

        return NextResponse.json({
            message:"Success"
        })
        
    } catch (error) {
        return NextResponse.json({
            message:"Something went wrong!",
            error
        })
    }
}