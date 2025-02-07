import { SidebarProvider } from "@/components/ui/sidebar";
import { EventsProvider } from "@/context/events-context";

export default async function ClassLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <EventsProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </EventsProvider>
    );
}
