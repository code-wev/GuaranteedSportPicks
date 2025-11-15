import { dbConnect } from "@/lib/dbConnect";

import bcrypt from 'bcrypt'
import User from "./UserModel";

export const saveUser = async(data)=>{

    await dbConnect()
 
    const orginalPassword = data.password;

    const hashPassword =await bcrypt.hash(orginalPassword, 10);
    data.password = hashPassword;
       const newUser = new User(data);
    const saved = await newUser.save();
 
    return saved;
}



