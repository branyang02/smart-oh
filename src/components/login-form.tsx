import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { signIn } from "@/lib/auth";
import { cn } from "@/lib/utils";

import { Icons } from "./icons";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3">
                        <form
                            action={async () => {
                                "use server";
                                await signIn("github", {
                                    redirectTo: "/"
                                });
                            }}
                            className="w-full"
                        >
                            <Button variant="outline" className="w-full">
                                <Icons.gitHub />
                                Login with Github
                            </Button>
                        </form>
                        <form
                            action={async () => {
                                "use server";
                                await signIn("google");
                            }}
                        >
                            <Button variant="outline" className="w-full">
                                <Icons.google />
                                Login with Google
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
