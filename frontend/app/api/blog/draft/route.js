import { NextResponse } from "next/server"
import { draftBlog } from "../BlogController";


export const PUT = async(req)=>{
    try {

        const data = await req.json();
        const {id} = data;
        const resp = await draftBlog(id);
        return NextResponse.json({
            message:"Success",
            data:resp

        }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error?.message,
            error
        })
    }
}