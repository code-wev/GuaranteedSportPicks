import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { getAllUsers } from "@/controllers/user.controller";

export async function GET() {
  try {
    await dbConnect();
    const users = await getAllUsers();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
