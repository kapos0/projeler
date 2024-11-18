import { connectToDB } from "@/utils/database";
import Ticket from "@/models/ticket.model";
import { NextResponse } from "next/server";
import { sendEmail } from "@/utils/sendEmail";

export async function GET() {
  try {
    connectToDB();
    const tickets = await Ticket.find();
    return NextResponse.json({ tickets }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    connectToDB();
    const body = await req.json();
    const ticketData = body.formData;
    const ticket = new Ticket(ticketData);
    await ticket.save();
    sendEmail(
      ticketData.title,
      ticketData.description,
      body.email || process.env.MAIL_TO
    );
    return NextResponse.json({ message: "Ticket Created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
