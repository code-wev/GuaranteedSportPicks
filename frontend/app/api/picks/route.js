import { NextResponse } from "next/server"
import {  deletePick, getAllPicksWithLiveOdds, savePicks } from "./PicksController";
import { dbConnect } from "@/lib/dbConnect";

export const POST = async(req)=>{
    await dbConnect();
    try {
        const data = await req.json();
        const saved = await savePicks(data);
        return NextResponse.json({
            message:"Success",
            data:saved
        }, {status:201})
        
    } catch (error) {

        return NextResponse.json({
            message:error.message,
            error
        }, {status:500})
    }
}


export const GET = async(req)=>{
    try {
        const data = await getAllPicksWithLiveOdds();
        return NextResponse.json({
            message:"Success",
            data
        }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error.message,
            error
        })
    }
}


export const DELETE = async(req)=>{
    await dbConnect();
    try {
        const data = await req.json();
        const {id} = data;
        const deleted = await deletePick(id);
        return NextResponse.json({
            message:"Success",
            data: deleted
        })
        
    } catch (error) {
        return NextResponse.json({
            message:error.message,
            error
        })
    }
}


