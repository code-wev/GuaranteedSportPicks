import { dbConnect } from "@/lib/dbConnect";

import { NextResponse } from "next/server"
import User from "../../UserModel";

export const PUT = async (req, context)=>{
    await dbConnect();
    try {

        const params = await context?.params;
        const id = params?.id;
        const updated = await User.updateOne({_id:id}, {$set:{
            status:"active"
        }});
        return NextResponse.json({
            message:"Success",
            data:updated

        }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error?.message
    })
    }
}