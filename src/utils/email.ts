import type { SentMessageInfo } from 'nodemailer';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = (destinator: string, subject: string, text: string) => {
  const mailOptions = {
    from: 'pronycosd@gmail.com',
    to: destinator,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error: Error | null, info: SentMessageInfo) => {
    if (error) {
      console.log(`Error sending email: ${error}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
};
