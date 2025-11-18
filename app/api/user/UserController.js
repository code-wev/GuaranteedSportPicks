import { dbConnect } from "@/lib/dbConnect";

import bcrypt from "bcrypt";
import User from "./UserModel";

export const saveUser = async (data) => {
  await dbConnect();

  const orginalPassword = data.password;

  const hashPassword = await bcrypt.hash(orginalPassword, 10);
  data.password = hashPassword;
  const newUser = new User(data);
  const saved = await newUser.save();

  return saved;
};

export const updateProfilePicture = async (img, email) => {
  await dbConnect();
  const updated = await User.updateOne(
    { email: email },
    {
      $set: {
        img: img,
      },
    }
  );
  return updated;
};

export const updateProfile = async (data) => {
  await dbConnect();

  const email = data?.email;

  const updated = await User.updateOne(
    { email: email },
    {
      $set: {
        fullName: data?.fullName,
        phoneNumber: data?.phoneNumber,
        img: data?.img,
        role: data?.role,
        status: data?.status,
        credits: data?.credits,
        isHandicapper: data?.isHandicapper,
        bio: data?.bio,
        affiliateCode: data?.affiliateCode,
        newsletterSubscribed: data?.newsletterSubscribed,
      },
    }
  );

  return updated;
};
