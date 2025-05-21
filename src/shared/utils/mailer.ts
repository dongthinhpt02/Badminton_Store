import nodemailer from "nodemailer";
import appConfig from "../common/config";

export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    // service: "gmail",
    auth: {
        user: appConfig.google.smtpGoogleEmail,
        pass: appConfig.google.smtpGooglePassword,
    },
});

export async function sendResetPasswordEmail(to: string, resetLink: string) {
    await transporter.sendMail({
        from: "Badminton Store",
        to,
        subject: "Reset your password",
        html: `
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>This link will expire in 1 hour.</p>
        `
    });
}