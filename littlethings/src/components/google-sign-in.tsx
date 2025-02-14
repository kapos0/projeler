import { googleSignIn } from "@/actions/googleSignIn";
import { Button } from "@/components/ui/button";

function GoogleSignInCom() {
    return (
        <form action={googleSignIn}>
            <Button className="w-full" variant="default">
                Continue with Google
            </Button>
        </form>
    );
}

export { GoogleSignInCom };
