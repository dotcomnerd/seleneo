import { signIn } from "@/lib/auth-client"
import { Button } from "../ui/button"

export function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn.social({ provider: "github" })
            }}
        >
            <Button type="submit">Sign In</Button>
        </form>
    )
}
