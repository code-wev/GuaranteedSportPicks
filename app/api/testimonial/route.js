import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server"
import {  deleteTestimonial, getAllTestimonial, saveTestimonial, updateTestimonial } from "./TestimonialController";

export const POST = async(req)=>{

    await dbConnect();
    try {
        const data = await req.json();
        const saved =await saveTestimonial(data);
        return NextResponse.json({
            message:"Success",
            data:saved
        }, {status:201})
        
        
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        }, {status:500})
    }
};



export const GET = async(req)=>{
    await dbConnect();
    try {
        const resp = await getAllTestimonial();
        return NextResponse.json({
            message:"Success",
            data:resp
        })
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        })
    }
};

export const DELETE = async (req) =>{
    await dbConnect();
    try {
        const data = await req.json();
        const {id} = data;
        const deleted = await deleteTestimonial(id);
        return NextResponse.json({
            message:"Success",
            data:deleted
        })
         
    } catch (error) {
        return NextResponse.json({
            error,
            message:error.message
        })
    }
};



export const PUT = async(req)=>{
    await dbConnect();
    try {

        const data = await req.json();
        const updated = updateTestimonial(data);
        return NextResponse.json({
            message:"Success",
            data:updated
        }, {status:201})
        
    } catch (error) {
        return NextResponse.json({
            message:error.message,
            error
        })
    }
}