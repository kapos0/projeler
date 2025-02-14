import { githubSignIn } from "@/actions/githubSignIn";
import { Button } from "@/components/ui/button";

function GithubSignInCom() {
    return (
        <form action={githubSignIn}>
            <Button className="w-full" variant="default">
                Continue with GitHub
            </Button>
        </form>
    );
}

export { GithubSignInCom };
