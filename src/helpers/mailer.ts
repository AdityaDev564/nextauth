import User from '@/models/userModel';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import { verify } from 'crypto';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        
        if(emailType === 'VERIFY'){
            await User.findByIdAndUpdate(userId, 
                {verifyToken: hashedToken, verifyTokenExpire: Date.now() + 3600000},
            )
        } else if(emailType === 'RESET'){
            await User.findByIdAndUpdate(userId, 
                {forgotPasswordToken: hashedToken, forgotPasswordTokenExpire: Date.now() + 3600000},
            )
        }


        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "5c769840593e3d",
              pass: "4c550fea3c4c19"
            }
          });
          
        const mailOptions = {
            from: 'adityadev564@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your email": "Reset your password", 
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "Verify your email": "Reset your Password"}
            or copy and paste the link below in your browser. <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`, // html body
        }

        const mailResponse = await transport.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message);
    }
}