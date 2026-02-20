import { NextResponse } from "next/server";
import { updateProfilePicture } from "../UserController";

export const PUT = async (req) => {
  try {
    const data = await req.json();
    const { img, email } = data;

    const updated = await updateProfilePicture(img, email);
    return NextResponse.json(
      {
        message: "Successs",
        data: updated,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({
      error,
      message: error.message,
    });
  }
};
