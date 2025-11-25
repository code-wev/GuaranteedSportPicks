import { dbConnect } from "@/lib/dbConnect";

import { NextResponse } from "next/server"
import bcrypt from 'bcrypt'
import User from "../UserModel";

export const POST = async(req)=>{
   await dbConnect()
    try {

        const data =await req.json();

        console.log(data, "datar sawa")
        const isExist = await User.findOne({email:data?.email});

        if(!isExist){
            return NextResponse.json({
                message:"User Not Found!"
            }, {status:401})
        }

        const compare =await bcrypt.compare(data.password, isExist.password);
        if(!compare){
            return NextResponse.json({
                message:"Password Dosen't Match"
            }, {status: 401})
        }

        return NextResponse.json({
            message:"Success",
            data:isExist
        })
        
    } catch (error) {
        return NextResponse.json({
                     error,
            message:error?.message
   
        })
    }
}