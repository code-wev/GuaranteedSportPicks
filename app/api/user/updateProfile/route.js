import { NextResponse } from "next/server"
import { updateProfile } from "../UserController";
import { dbConnect } from "@/lib/dbConnect";

export const PUT = async(req)=>{
    await dbConnect()
    try {

        const data = await req.json();
        const updated = await updateProfile(data);
        return NextResponse.json({
            message:"Success",
            data:updated
        });
        

        
    } catch (error) {

        return NextResponse.json({
            error,
            message:error.message
        }, {status:500})
    }
}