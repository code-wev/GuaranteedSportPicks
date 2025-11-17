import { dbConnect } from "@/lib/dbConnect"
import { NextResponse } from "next/server"
import { updateBlog } from "../BlogController";

export const PATCH = async(req)=>{
    await dbConnect();
    try {
        const data = await req.json();
      const updated =  await updateBlog(data);

      return NextResponse.json({
        message:"Success",
        data:updated

      }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error.message,
            error
        }, {status:500})
    }
}