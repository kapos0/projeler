import Link from "next/link";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { fetchUser } from "@/controllers/userController";

export default async function Navbar() {
    let userName: string | "Guest";
    try {
        const user = await fetchUser();
        userName = user?.username;
    } catch {
        return null;
    }
    return (
        <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            href="/"
                            className="text-xl font-bold text-primary font-mono tracking-wider"
                        >
                            Mind-Flicks
                        </Link>
                    </div>

                    <DesktopNavbar />
                    <MobileNavbar userName={userName.toString()} />
                </div>
            </div>
        </nav>
    );
}
