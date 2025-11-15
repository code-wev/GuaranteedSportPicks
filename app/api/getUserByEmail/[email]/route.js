import { dbConnect } from "@/lib/dbConnect";

import { NextResponse } from "next/server";
import User from "../../user/UserModel";

export const GET = async (req, context) => {
    
const params = await context.params;
const email = params.email
console.log(email, "ay parmas ay")
await dbConnect()
  try {

    

 

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: error?.message, error }, { status: 500 });
  }
};
