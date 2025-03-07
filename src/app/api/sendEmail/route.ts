import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, address, phonenumber, email } = await req.json();

    if (!email || !address || !phonenumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log(process.env.EMAIL_USER)

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "beautifulinteractions@gmail.com",
      subject:  name + " has applied for our service!",
      text: `${"Restaurant's address:  " + address}\n${ "Restaurant's name:  " + name}\n${"Owner's email:  " +email}\n${"Restaurant's phone number:  " + phonenumber}`,
    });

    return NextResponse.json({ message: "Email sent successfully!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error sending email" + error}, { status: 500 });
  }
}
