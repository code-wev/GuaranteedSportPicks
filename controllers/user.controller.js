
// import bcrypt from "bcryptjs";

import User from "@/app/api/user/UserModel";

// Register user
export const registerUser = async ({ fullName, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  // const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  return newUser;
};

// Get all users
export const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};
