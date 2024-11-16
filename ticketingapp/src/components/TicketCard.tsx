import StatusDisplay from "./StatusDisplay";
import PriorityDisplay from "./PriorityDisplay";
import DeleteBlock from "./DeleteBlock";
import ProgressDisplay from "./ProgressDisplay";
import Link from "next/link";
import { TicketType } from "@/models/ticket.model";

export default function TicketCard({ ticket }: { ticket: TicketType }) {
  function formatTimestamp(timestamp: string | number) {
    const options = {
      year: "numeric" as const,
      month: "2-digit" as const,
      day: "2-digit" as const,
      hour: "2-digit" as const,
      minute: "2-digit" as const,
      hour12: false,
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString("tr-TR", options);

    return formattedDate;
  }

  const createdDateTime = formatTimestamp(
    ticket.createdAt ? ticket.createdAt : ""
  );

  return (
    <div className="flex flex-col hover:bg-card-hover bg-card rounded-md shadow-lg p-3 m-2">
      <div className="flex mb-3">
        <PriorityDisplay priority={ticket.priority} />
        <div className="ml-auto">
          <DeleteBlock id={ticket._id!} />
        </div>
      </div>
      <Link href={`/ticketpage/${ticket._id}`} style={{ display: "contents" }}>
        <h4 className="mb-1">{ticket.title}</h4>
        <hr className="h-px  border-0 bg-page mb-2 "></hr>
        <p className="whitespace-pre-wrap">{ticket.description}</p>

        <div className="flex-grow"></div>
        <div className="flex mt-2">
          <div className="flex flex-col">
            <p className="text-xs  my-1">{createdDateTime}</p>
            <ProgressDisplay progress={ticket.progress} />
          </div>
          <div className="ml-auto  flex items-end">
            <StatusDisplay status={ticket.status} />
          </div>
        </div>
      </Link>
    </div>
  );
}
