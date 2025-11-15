import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "../UserModel";


export const POST = async (req) => {
  await dbConnect();

  try {
    const data = await req.json();
    console.log(data, "Rakib tui header developer");

    // Check existing user
    const isExist = await User.findOne({ email: data?.email });

    if (isExist) {
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 409 }
      );
    }

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
