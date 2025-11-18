import nodemailer from "nodemailer";
import { otpGenerator } from "@/utils/utils";
import OtpModel from "./OtpModel";
import { dbConnect } from "@/lib/dbConnect";

export const sendOtp = async (email) => {
    await dbConnect();
  const otp = otpGenerator();

  const isExist = await OtpModel.find({email:email});
  if(isExist){
    const deleted = await OtpModel.deleteMany({email:email})
  }

  // 1) Transporter
 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "bannah76769@gmail.com",
    pass: "noqq kzxv olzf clzz",
  },});

  // 2) Beautiful Email HTML (Theme matched)
  const htmlTemplate = `
  <div style="
      background: #1a1a1a;
      padding: 40px 0;
      font-family: Arial, sans-serif;
      color: #fff;
      text-align: center;
  ">
      <div style="
          max-width: 520px;
          margin: auto;
          background: #591616;
          border: 1px solid #cf8d8c;
          border-radius: 18px;
          padding: 35px 25px;
      ">
          
          <h2 style="font-size: 28px; font-weight: 700; margin-bottom: 10px;">
              Your Verification Code
          </h2>
          <p style="color: #ddd; font-size: 16px; margin-bottom: 30px;">
              Use the OTP below to verify your email address.
          </p>

          <div style="
              font-size: 48px;
              font-weight: 800;
              color: #E53935;
              letter-spacing: 8px;
              margin-bottom: 35px;
          ">
              ${otp}
          </div>

          <p style="color: #cfcfcf; margin-bottom: 30px;">
              This code will expire in <strong>4 minutes</strong>.  
              If you didn't request this, please ignore this email.
          </p>

      

          <p style="margin-top: 25px; color:#aaa; font-size: 13px;">
              Secure • Verified System • Trusted Platform
          </p>
      </div>
  </div>
  `;

  const emailData = {
    email,
    otp
  }

  const newOtp = new OtpModel(emailData);
  const saved = await newOtp.save();
  // 3) Send email
  const info = await transporter.sendMail({
    from: `"Expert Sports Picks" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your Email Verification Code",
    html: htmlTemplate,
  });

  return { message: "OTP Sent Successfully", otp, info };
};
