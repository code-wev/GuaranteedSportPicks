import { NextResponse } from "next/server";
import { saveUser } from "../UserController";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user.model";

export const POST = async(req)=>{
    await dbConnect()
    try {

        const data = await req.json();


        const isExist = await User.findOne({email:data?.email});
        if(isExist){
            return NextResponse.json({
                message:"User Already Exist",

            }, {status:401})
        }

        const saved = await saveUser(data);
        return NextResponse.json({
            message:'Success',
            data:saved

        }, {status:201})
        
    
        
    } catch (error) {
        console.log(error, "This is my personal error")
        return NextResponse.json({
              error,
            message:error.message
          
        }, {status:500})
    }

}