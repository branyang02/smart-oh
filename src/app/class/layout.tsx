import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { EventsProvider } from "@/context/events-context";
import mockData from "@/data";
import { auth } from "@/lib/auth";
import { ClassItem } from "@/types/index";

export default async function ClassLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const user = {
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com"
    };

    // const classes: ClassItem[] = [];
    const classes: ClassItem[] = mockData.classes;

    return (
        <EventsProvider>
            <SidebarProvider>
                <AppSidebar user={user} classes={classes} />
                <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
        </EventsProvider>
    );
}
