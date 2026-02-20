import { NextResponse } from "next/server";
import { deleteUserById } from "../../UserController";
import { dbConnect } from "@/lib/dbConnect";

// export const DELETE = async (req, { params }) => {
//   await dbConnect();

//   try {
//     const { id } = params;

//     const deleted = await deleteUserById(id);

//     return NextResponse.json({
//       message: "User deleted successfully",
//       data: deleted,
//     });
//   } catch (error) {
//     return NextResponse.json({ message: error.message }, { status: 500 });
//   }
// };

export const DELETE = async (req, context) => {
  await dbConnect();

  try {
    // এখানে context.params থেকে param নিও
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await deleteUserById(id);

    return NextResponse.json({
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};