import mongoose, { Schema } from "mongoose";
const ticketSchema = new Schema(
  {
    title: String,
    description: String,
    category: String,
    priority: Number,
    progress: Number,
    status: String,
    active: Boolean,
  },
  { timestamps: true }
);

const Ticket = mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);

export default Ticket;
export type TicketType = {
  _id?: string;
  title: string;
  description: string;
  category: string;
  priority: number;
  progress: number;
  status: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
};
