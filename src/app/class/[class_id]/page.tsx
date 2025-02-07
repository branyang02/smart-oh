"use client";

import { AppHeader } from "@/components/app-header";
import { useClass } from "@/context/class-context";

export default function ClassPage() {
    const { activeClassId, course } = useClass();

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    { href: `/class/${activeClassId}`, label: course.name }
                ]}
            />
            <div className="flex flex-1 flex-col items-center min-h-screen">
                <h1>Class Page</h1>
            </div>
        </>
    );
}
