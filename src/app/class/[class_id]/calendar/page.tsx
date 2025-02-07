"use client";

import { AppHeader } from "@/components/app-header";
import Calendar from "@/components/calendar";
import { useClass } from "@/context/class-context";
import { EventsProvider } from "@/context/events-context";

export default function CalendarPage() {
    const { activeClassId, course } = useClass();

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    { href: `/class/${activeClassId}`, label: course.name },
                    { label: "Calendar" }
                ]}
            />
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <EventsProvider>
                    <Calendar />
                </EventsProvider>
            </div>
        </>
    );
}
