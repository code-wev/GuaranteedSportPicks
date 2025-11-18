import User from "../user/UserModel"
import bcrypt from 'bcrypt'

export const forgetPassword = async(email, newPassword)=>{

    const hashPassword = await bcrypt.hash(newPassword, 10)
    const updated = await User.updateOne({email:email}, {$set:{password:hashPassword}});
    return updated;
}