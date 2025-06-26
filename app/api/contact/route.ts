import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
})

const TO_EMAIL = process.env.CONTACT_TO_EMAIL // your email

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json()
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    if (!TO_EMAIL) {
      return NextResponse.json({ error: "Recipient email is not configured" }, { status: 500 })
    }

    // Email to you
    const mailToYou = await transporter.sendMail({
      from: `Portfolio Contact <${process.env.GMAIL_USER}>`,
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email,
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`
    })
    console.log('Nodemailer to you:', mailToYou)

    // Auto-reply to user
    const mailToUser = await transporter.sendMail({
      from: `Abhishek Kumar <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting me!',
      html: `<p>Hi ${name},</p><p>Thank you for reaching out! I have received your message and will get back to you shortly.</p><p>Best regards,<br/>Abhishek Kumar</p>`
    })
    console.log('Nodemailer to user:', mailToUser)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
