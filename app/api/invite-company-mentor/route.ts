import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { companyMentorEmail } = await req.json();

    if (!companyMentorEmail) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: companyMentorEmail,
      subject: 'Register as a Company Mentor at InternSync',
      text: `Hello,

        You have been invited to register as a company mentor on InternSync.

        Please click the link below to register:
        ${process.env.NEXT_PUBLIC_URL}/register/company-mentor

        Best regards,
        InternSync Team`,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json(
      { message: 'Invite sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { message: 'Failed to send invite' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}
