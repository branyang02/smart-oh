"use client";

import { AppHeader } from "@/components/app-header";
import { useClass } from "@/context/class-context";
import { EventsProvider } from "@/context/events-context";

import { StudentViewSettings } from "./student-view";

export default function CalendarPage() {
    const { activeClass, activeRole } = useClass();
    if (!activeClass || !activeRole) return null;

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    {
                        href: `/class/${activeClass.id}`,
                        label: activeClass.name
                    },
                    { label: "Settings" }
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                {activeRole === "student" ? (
                    <StudentViewSettings />
                ) : activeRole === "TA" ? (
                    <div>TA View</div>
                ) : (
                    <div>Instructor View</div>
                )}
            </div>
        </>
    );
}
