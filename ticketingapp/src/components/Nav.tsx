import Link from "next/link";

export default function Nav() {
  return (
    <nav className="flex justify-between bg-nav p-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <i className="icon bi bi-house-fill"></i>
        </Link>
        <Link href="/ticketpage/new">
          <i className="icon bi bi-ticket-fill"></i>
        </Link>
      </div>
      <div>
        <p className=" text-default-text">eden.turhann@gmail.com</p>
      </div>
    </nav>
  );
}
