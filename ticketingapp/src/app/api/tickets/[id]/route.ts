import Ticket from "@/models/ticket.model";
import { sendEmail } from "@/utils/sendEmail";
import { NextResponse } from "next/server";
type Params = { id: string };

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  const foundTicket = await Ticket.findOne({ _id: id });
  const ticket = foundTicket.toObject();
  return NextResponse.json({ ...ticket }, { status: 200 });
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    const body = await request.json();
    const ticketData = body.formData;

    await Ticket.findByIdAndUpdate(id, {
      ...ticketData,
    });
    sendEmail(
      ticketData.title,
      ticketData.description,
      body.email || process.env.MAIL_TO
    );
    return NextResponse.json({ message: "Ticket updated" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    await Ticket.findByIdAndDelete(id);
    return NextResponse.json({ message: "Ticket Deleted" }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
