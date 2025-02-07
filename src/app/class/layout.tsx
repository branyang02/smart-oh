import { SidebarProvider } from "@/components/ui/sidebar";
import { EventsProvider } from "@/context/events-context";

export default async function BaseLayout({
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
