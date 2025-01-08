import { signIn } from "@/lib/auth"
import { Button } from "../ui/button"

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("github")
            }}
        >
            <Button type="submit">Sign In</Button>
        </form>
    )
}
