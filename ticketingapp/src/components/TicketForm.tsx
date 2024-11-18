"use client";
import { useRouter } from "next/navigation";
import { TicketType } from "@/models/ticket.model";
import { useState } from "react";

export default function EditTicketForm({ ticket }: { ticket: TicketType }) {
  const EDITMODE = ticket._id === "new" ? false : true;
  const router = useRouter();
  const startingTicketData = {
    title: "",
    description: "",
    priority: 1,
    progress: 0,
    status: "Başlanmadı",
    category: "Diğer",
  };

  if (EDITMODE) {
    startingTicketData["title"] = ticket.title;
    startingTicketData["description"] = ticket.description;
    startingTicketData["priority"] = ticket.priority;
    startingTicketData["progress"] = ticket.progress;
    startingTicketData["status"] = ticket.status;
    startingTicketData["category"] = ticket.category;
  }

  const [formData, setFormData] = useState(startingTicketData);
  const [selectedEmail, setSelectedEmail] = useState("dalinnx1@gmail.com");

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const value = e.target.value;
    const name = e.target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  }

  function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedEmail(e.target.value);
  }

  const bodyData = { formData, email: selectedEmail };
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (EDITMODE) {
      const res = await fetch(`/api/tickets/${ticket._id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) {
        throw new Error("Failed to update ticket");
      }
    } else {
      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });
      if (!res.ok) {
        throw new Error("Failed to create ticket");
      }
    }

    router.refresh();
    router.push("/");
  }

  const categories = [
    "Donanım problemi",
    "Yazılım problemi",
    "Personal şikayeti",
    "Personel ihtiyacı",
    "Diğer",
  ];

  return (
    <div className="flex justify-center">
      <form
        onSubmit={handleSubmit}
        method="post"
        className="flex flex-col gap-3 w-1/2"
      >
        <h3>{EDITMODE ? "Güncelle" : "Oluştur"}</h3>
        <label>Başlık</label>
        <input
          id="title"
          name="title"
          type="text"
          onChange={handleChange}
          required={true}
          value={formData.title}
        />
        <label>Açıklama</label>
        <textarea
          id="description"
          name="description"
          onChange={handleChange}
          required={true}
          value={formData.description}
          rows={5}
        />
        <label>Kategori</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          {categories?.map((category, _index) => (
            <option key={_index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>Aciliyet derecesi</label>
        <div>
          {[1, 2, 3, 4, 5].map((priority) => (
            <span key={priority}>
              <input
                id={`priority-${priority}`}
                name="priority"
                type="radio"
                onChange={handleChange}
                value={priority}
                checked={formData.priority == priority}
              />
              <label>{priority}</label>
            </span>
          ))}
        </div>
        <label>İlerleme</label>
        <input
          type="range"
          id="progress"
          name="progress"
          value={formData.progress}
          min="0"
          max="100"
          onChange={handleChange}
        />
        <label>Durum</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Başlanmadı">Başlanmadı</option>
          <option value="Başlandı">Başlandı</option>
          <option value="Bitti">Bitti</option>
        </select>
        <label>Sorumlu Kişi Seçimi</label>
        <div>
          <input
            type="radio"
            id="mudur"
            name="email"
            value="dalinnx1@gmail.com"
            checked={selectedEmail === "dalinnx1@gmail.com"}
            onChange={handleEmailChange}
          />
          <label htmlFor="mudur">Müdüre</label>
          <input
            type="radio"
            id="tekniker"
            name="email"
            value="dalinnx1@gmail.com"
            checked={selectedEmail === "dalinnx1@gmail.com"}
            onChange={handleEmailChange}
          />
          <label htmlFor="tekniker">Teknikere</label>
        </div>
        <input
          type="submit"
          className="btn max-w-xs"
          value={EDITMODE ? "Güncelle" : "Oluştur"}
        />
      </form>
    </div>
  );
}
