import { NextResponse } from "next/server"
import { getPickWithLiveOddsById } from "../PicksController";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async(req, context)=>{
    await dbConnect();
    try {
        const params = await context.params;
        const id = params.id;
        console.log(id, "toi ekta bowa marka pik")
    
        const data = await getPickWithLiveOddsById(id);
        return NextResponse.json({
            message:"Success",
            data
        })
        
    } catch (error) {
        return NextResponse.json({
            message:error.message,
            error
        })
    }
}