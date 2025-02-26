"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const router = useRouter();

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <AlertDialog defaultOpen>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Something went wrong!</AlertDialogTitle>
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => router.push("/")}>
                        Go Home
                    </AlertDialogAction>
                    <AlertDialogAction onClick={reset}>
                        Try again
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
