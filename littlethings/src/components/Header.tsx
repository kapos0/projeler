import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";
import { SignOut } from "./sign-out";
import { SignIn } from "./sign-in";
import { auth } from "@/lib/auth";

export default async function Header() {
    const session = await auth();
    return (
        <div className="flex justify-between items-center p-3 max-w-6xl mx-auto">
            <ul className="flex gap-4 items-center">
                <li>{session ? <SignOut /> : <SignIn />}</li>
                <li className="hidden sm:block">
                    <Link href={"/"}>Home</Link>
                </li>
                <li className="hidden sm:block">
                    <Link href={"/favorites"}>Favorites</Link>
                </li>
                <li className="hidden sm:block">
                    <Link href={"/about"}>About</Link>
                </li>
            </ul>
            <div className="flex items-center gap-4">
                <DarkModeSwitch />
                <Link href={"/"} className="flex gap-1 items-center">
                    <span className="text-2xl font-bold bg-amber-500 py-1 px-2 rounded-lg">
                        Things
                    </span>
                </Link>
            </div>
        </div>
    );
}
