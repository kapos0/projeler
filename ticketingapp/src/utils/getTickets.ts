export async function getTicket(id?: string) {
  try {
    const res = await fetch(`${process.env.PUBLIC_URL}/api/tickets/${id ? id : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch topic");
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
