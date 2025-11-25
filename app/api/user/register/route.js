import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "../UserModel";
import bcrypt from 'bcrypt'


export const POST = async (req) => {
  await dbConnect();

  try {
    const data = await req.json();
    console.log(data);

    // Check existing user
    const isExist = await User.findOne({ email: data?.email });

    if (isExist) {
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 409 }
      );
    }


    const hashPassword = await bcrypt.hash(data.password, 10);
    data.password = hashPassword;

    // Create new user
    const newUser = new User(data);
    const savedUser = await newUser.save();

    return NextResponse.json(
      {
        message: "Success",
        data: savedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error:", error);

    return NextResponse.json(
      {
        error,
        message: error.message,
      },
      { status: 500 }
    );
  }
};
