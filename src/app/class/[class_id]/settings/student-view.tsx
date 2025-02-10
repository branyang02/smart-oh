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

export function StudentViewSettings() {
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
                <Button variant="destructive">Leave Class</Button>
            </CardFooter>
        </Card>
    );
}
