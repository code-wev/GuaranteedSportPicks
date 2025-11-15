
import { NextResponse } from "next/server";
import User from "../../UserModel";

export const GET = async (req, context) => {
  try {

    let userId = context?.params?.id;


    if (!userId) {
      const url = new URL(req.url);
      const segments = url.pathname.split("/").filter(Boolean); 
      userId = segments[segments.length - 1]; 
    }

    console.log("Dynamic ID:", userId);

    if (!userId) {
      return NextResponse.json({ message: "ID not found in URL" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Success", data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ message: error?.message, error }, { status: 500 });
  }
};
