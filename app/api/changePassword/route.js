import { NextResponse } from "next/server";
import User from "../user/UserModel";
import bcrypt from "bcrypt";
import { changePassword } from "./changePasswordController";
import { dbConnect } from "@/lib/dbConnect";

export const PUT = async (req) => {
    await dbConnect();
  try {
    const data = await req.json();
    const { email, oldPassword, newPassword } = data;
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      return NextResponse.json(
        {
          message: "User Not Found!",
        },
        { status: 401 }
      );
    }

    const compare = await bcrypt.compare(oldPassword, isExist.password);
    if (!compare) {
      return NextResponse.json(
        {
          message: "Wrong Password!",
        },
        { status: 401 }
      );
    }

    
    const updated = await changePassword(email, newPassword)
    return NextResponse.json({
      message: "success",
      data:updated
    });
  } catch (error) {
    return NextResponse.json({
      message: error.message,
    });
  }
};
