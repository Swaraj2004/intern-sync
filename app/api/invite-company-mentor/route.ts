import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { companyMentorEmail, studentName } = await req.json();

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
      subject: `Request to Grant Internship for ${studentName}`,
      text: `Respected Sir/Madam,

I hope this email finds you well. I am Prof. Akshay Jadhav, the Internship Coordinator from Pillai College of Engineering, New Panvel. One of our students, ${studentName}, has recently joined your esteemed organization for an internship.
As this internship is part of our credit-based program, it is essential for us to monitor the student’s progress through attendance records, periodic reports, and feedback from your side. To facilitate this process, we kindly request you to register on our official platform at:
${process.env.NEXT_PUBLIC_URL}/register/company-mentor?email=${companyMentorEmail}
After registering you will recieve a verification email. And after verification, you will be able to view the dashboard and check student's attendance and daily reports. It is requested to complete the profile and add the company coordinates and company radius of atleast 500 meters, this is improtant as the student will be able to mark attendance based on this.
Your cooperation in this regard will greatly assist us in ensuring a meaningful and fruitful internship experience for the student. Please do not hesitate to reach out to me for any clarifications or further details.
Looking forward to your kind support.

Warm regards,
Prof. Akshay Jadhav
Assistant Professor,
Internship Coordinator,
Department of Electronics & Computer Science.
Pillai College of Engineering, New Panvel
9405391714
akshayjadhav@mes.ac.in`,
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
