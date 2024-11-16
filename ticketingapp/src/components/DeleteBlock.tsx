"use client";
import { useRouter } from "next/navigation";

export default function DeleteBlock({ id }: { id: string }) {
  const router = useRouter();

  async function deleteTicket() {
    const res = await fetch(`/api/tickets/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.refresh();
    }
  }

  return (
    <i
      className="icon bi bi-dash-circle text-red-400 hover:cursor-pointer hover:text-red-200"
      onClick={deleteTicket}
    />
  );
}
