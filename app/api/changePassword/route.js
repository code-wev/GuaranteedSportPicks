import { NextResponse } from "next/server"

export const PUT = async(req)=>{
    try {
        return NextResponse.json({
            message:"success"
        })
    } catch (error) {
        return NextResponse.json({
            message:error.message
        })
    }
}