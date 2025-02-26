"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { useClass } from "@/context/class-context";
import { leaveClass } from "@/db/classes";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function StudentViewSettings() {
    const router = useRouter();
    const { toast } = useToast();

    const { user, activeClass } = useClass();
    if (!user || !activeClass) return null;

    async function onLeaveClass() {
        try {
            await leaveClass(user.id, activeClass!.id);
            toast({
                title: "Success!",
                description: `You have left ${activeClass!.name}.`,
                variant: "default"
            });
            router.push("/");
            router.refresh();
        } catch (error) {
            toast({
                title: "Uh oh! Something went wrong.",
                description:
                    error instanceof Error
                        ? error.message
                        : "There was a problem with your request.",
                variant: "destructive"
            });
        }
    }

    return (
        <Card className="mt-8 border-2 border-red-500">
            <CardHeader>
                <CardTitle>Leave Class</CardTitle>
                <CardDescription>
                    Remove yourself from this class. This action cannot be
                    undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                Are you sure you want to leave this class? You will lose access
                to all class materials and assignments.
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button variant="destructive" onClick={onLeaveClass}>
                    Leave Class
                </Button>
            </CardFooter>
        </Card>
    );
}
