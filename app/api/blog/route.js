import { NextResponse } from "next/server"
import { deleteBlog, saveBlog } from "./BlogController";
import { dbConnect } from "@/lib/dbConnect";

export const POST = async(req)=>{
    await dbConnect()
    try {
        const data = await req.json();
       const saved = await saveBlog(data);
       return NextResponse.json({
        message:"Success",
        data:saved
       })

        
    } catch (error) {
        return  NextResponse.json({
            message:error.message,
            error
        }, {status:500})
    }
};



export const DELETE = async(req)=>{
    await dbConnect();
    try {

        const data = await req.json();
        const {id} = data;

        const deleted = await deleteBlog(id);
        return NextResponse.json({
            message:"Success",
            data:deleted
        }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error?.message,
            error
        })
    }
}