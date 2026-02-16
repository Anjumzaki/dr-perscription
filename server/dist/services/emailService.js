"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your app password
    },
    tls: {
        rejectUnauthorized: false
    }
});
const sendVerificationEmail = async (email, verificationToken, name) => {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@mediconsult.com',
        to: email,
        subject: 'MediConsult - Verify Your Email Address',
        html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Inter', Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background-color: #1193d4; color: white; padding: 12px; border-radius: 50%; margin-bottom: 20px;">
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9h-3V7c0-.55-.45-1-1-1s-1 .45-1 1v4H8c-.55 0-1 .45-1 1s.45 1 1 1h3v4c0 .55.45 1 1 1s1-.45 1-1v-4h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
          </div>
          <h1 style="color: #1193d4; font-size: 28px; margin: 0;">MediConsult</h1>
        </div>
        
        <div style="background-color: #f6f7f8; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #101c22; margin-top: 0;">Welcome to MediConsult, Dr. ${name}!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Thank you for registering as a healthcare professional on MediConsult. To complete your registration and start managing your consultations, please verify your email address.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verificationUrl}" 
             style="display: inline-block; background-color: #1193d4; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
          <p style="color: #dc2626; margin: 0; font-size: 14px;">
            <strong>Important:</strong> This verification link will expire in 24 hours. If you didn't create this account, please ignore this email.
          </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 40px;">
          If the button above doesn't work, copy and paste this link into your browser:<br>
          <a href="${verificationUrl}" style="color: #1193d4; word-break: break-all;">${verificationUrl}</a>
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
          © 2024 MediConsult. All rights reserved.<br>
          This email was sent to ${email}
        </p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@mediconsult.com',
        to: email,
        subject: 'Welcome to MediConsult - Your Account is Verified!',
        html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: 'Inter', Arial, sans-serif;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="display: inline-block; background-color: #1193d4; color: white; padding: 12px; border-radius: 50%; margin-bottom: 20px;">
            <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-9h-3V7c0-.55-.45-1-1-1s-1 .45-1 1v4H8c-.55 0-1 .45-1 1s.45 1 1 1h3v4c0 .55.45 1 1 1s1-.45 1-1v-4h3c.55 0 1-.45 1-1s-.45-1-1-1z"/>
            </svg>
          </div>
          <h1 style="color: #1193d4; font-size: 28px; margin: 0;">MediConsult</h1>
        </div>
        
        <div style="background-color: #f0f9ff; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
          <h2 style="color: #101c22; margin-top: 0;">🎉 Account Verified Successfully!</h2>
          <p style="color: #6b7280; font-size: 16px; line-height: 1.6;">
            Congratulations, Dr. ${name}! Your email has been verified and your MediConsult account is now fully activated.
          </p>
        </div>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/dashboard" 
             style="display: inline-block; background-color: #1193d4; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Access Your Dashboard
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center;">
          You can now start using MediConsult to manage your consultations and prescriptions.
        </p>
      </div>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${email}`);
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
    }
};
exports.sendWelcomeEmail = sendWelcomeEmail;
