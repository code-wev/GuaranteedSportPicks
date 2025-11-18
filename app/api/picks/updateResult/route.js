import { NextResponse } from "next/server"
import { udpateResult } from "../PicksController";


export const PUT = async(req)=>{
    try {
        const data = await req.json();
        const {id, result} = data;
        const udpated = await udpateResult(id, result);
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