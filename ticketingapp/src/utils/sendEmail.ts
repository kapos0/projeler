import nodemailer from "nodemailer";

export async function sendEmail(subject: string, text: string): Promise<void> {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("E-posta başarıyla gönderildi");
  } catch (error) {
    console.error("E-posta gönderim hatası:", error);
  }
}
