import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)
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
    const toYou = await resend.emails.send({
      from: 'Portfolio Contact <contact@misanthropic.site>',
      to: TO_EMAIL,
      subject: `New Contact Form Submission from ${name}`,
      replyTo: email, // Use correct property name
      html: `<p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b> ${message}</p>`
    })
    console.log('Resend to you:', toYou)

    // Auto-reply to user
    const toUser = await resend.emails.send({
      from: 'Abhishek Kumar <onboarding@resend.dev>',
      to: email,
      subject: 'Thank you for contacting me!',
      html: `<p>Hi ${name},</p><p>Thank you for reaching out! I have received your message and will get back to you shortly.</p><p>Best regards,<br/>Abhishek Kumar</p>`
    })
    console.log('Resend to user:', toUser)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
