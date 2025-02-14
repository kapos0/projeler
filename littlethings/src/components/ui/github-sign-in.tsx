import { Button } from "@/components/ui/button";
import { Github } from "@/components/ui/github";
import { signIn } from "@/lib/auth";

function GithubSignIn() {
    return (
        <form
            action={async () => {
                "use server";
                await signIn("github");
            }}
        >
            <Button className="w-full" variant="outline">
                <Github />
                Continue with GitHub
            </Button>
        </form>
    );
}

export { GithubSignIn };
