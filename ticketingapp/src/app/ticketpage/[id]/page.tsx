import EditTicketForm from "@/components/TicketForm";
import { TicketType } from "@/models/ticket.model";
import { getTicket } from "@/utils/getTickets";

type Params = { id: string };
let updateTicketData: TicketType;

export default async function TicketPage({ params }: { params: Params }) {
  const { id } = await params;
  const EDITMODE = id === "new" ? false : true;

  if (EDITMODE) {
    updateTicketData = await getTicket(id);
  } else {
    updateTicketData = {
      _id: "new",
      title: "",
      description: "",
      category: "",
      priority: 0,
      progress: 0,
      active: true,
      status: "",
    };
  }

  return <EditTicketForm ticket={updateTicketData} />;
}
