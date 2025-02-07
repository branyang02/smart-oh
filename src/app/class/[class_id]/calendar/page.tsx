import { AppHeader } from "@/components/app-header";
import Calendar from "@/components/calendar";
import { EventsProvider } from "@/context/events-context";

export default async function CalendarPage({
    params
}: {
    params: { class_id: string };
}) {
    const classTitle = "HEHE";

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    { href: `/class/${params.class_id}`, label: classTitle },
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
