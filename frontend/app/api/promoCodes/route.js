import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server"
import PromoCodes from "./promoCodeModel";

export const POST = async (req)=>{


    await dbConnect();
    try {

const data = await req.json() ;


const isExist = await PromoCodes.findOne({name:data?.name});

if(isExist){
    return NextResponse.json({
        message:"Name Must be unique",
        

    }, {status: 401})
}
const newData = new PromoCodes(data);

const savedData =await newData.save();
return NextResponse.json({
    message:"Success",
    data:savedData

})       
        
    } catch (error) {
        return NextResponse.json({
            message:error?.message,
            error
        })
    }
}

export const GET = async(req)=>{
    try {
        const promoCodes = await PromoCodes.find();
        return NextResponse.json({
            message:"Success",
            data: promoCodes
        })
        
    } catch (error) {
        return NextResponse.json({
            message:error?.message
        }, {status:500})
    }
}


export const PUT = async(req)=>{
    try {
        const data = await req.json();
        const isExist = await PromoCodes.findOne({name:data?.name});
        if(!isExist){
            return NextResponse.json({
                message:"Promo code not exist",
                
            }, {status:401})
        }

     
        const status = data?.isActive;

        const updated = await PromoCodes.updateOne({name:data?.name},{ $set:{isActive:status}});
        return NextResponse.json({
            message:"Success",
            data:updated
        })
        
    } catch (error) {
        return NextResponse.json({
            message:''
        }, {status:500})
    }
}


export const DELETE = async(req)=>{
    try {
        const data = await req.json();
        const name = data?.name;
        const deleted = await PromoCodes.deleteOne({name: name});

        return NextResponse.json({
            message:"Success",
            data:deleted
        }, {status: 201})
        

        
    } catch (error) {
        return NextResponse.json({
            message:error?.message,
            error
        })
    }
}