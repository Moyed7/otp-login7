import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const expiry = Date.now() + 5 * 60 * 1000;

  const transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: process.env.SENDGRID_API_KEY,
    },
  });

  try {
    await transporter.sendMail({
      from: "noreply@example.com",
      to: email,
      subject: "رمز التحقق OTP",
      html: `<p>رمز التحقق الخاص بك هو <strong>${otp}</strong>. ينتهي خلال 5 دقائق.</p>`,
    });

    return res.status(200).json({ success: true, message: "تم إرسال OTP" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "فشل في الإرسال", error });
  }
}