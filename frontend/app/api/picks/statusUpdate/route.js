import { NextResponse } from "next/server"
import { udpateStatus } from "../PicksController";

export const PUT = async(req)=>{
    try {
        const data = await req.json();
        const {id, status} = data;
        const udpated = await udpateStatus(id, status);
        return NextResponse.json({
            message:"Success",
            data:udpated
        })
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        })
    }
}