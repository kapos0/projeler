import TicketCard from "@/components/TicketCard";
import { TicketType } from "@/models/ticket.model";
import { getTicket } from "@/utils/getTickets";
export default async function Dashboard() {
  const data = await getTicket();

  if (!data?.tickets || data?.tickets.length === 0) {
    return (
      <h1 className="m-2 flex justify-center align-center">Bisi yok :d</h1>
    );
  }

  const tickets = data.tickets;

  const uniqueCategories: string[] = [
    ...new Set(
      tickets?.map(({ category }: { category: string }) => category) as string[]
    ),
  ];
  return (
    <div className="p-5">
      <div>
        {tickets &&
          uniqueCategories?.map(
            (uniqueCategory: string, categoryIndex: number) => (
              <div key={categoryIndex} className="mb-4">
                <h2>{uniqueCategory}</h2>
                <div className="lg:grid grid-cols-2 xl:grid-cols-4 ">
                  {tickets
                    .filter(
                      (ticket: TicketType) => ticket.category === uniqueCategory
                    )
                    .map((filteredTicket: TicketType, _index: number) => (
                      <TicketCard key={_index} ticket={filteredTicket} />
                    ))}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}
