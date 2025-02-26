import { SidebarProvider } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { EventsProvider } from "@/context/events-context";
import { getUserClassesFromUserId } from "@/db/classes";
import { getUser } from "@/utils/user-utils";

export default async function BaseLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const userClasses = await Promise.resolve(
        getUserClassesFromUserId(user.id)
    );

    return (
        <EventsProvider>
            <SidebarProvider>
                <ClassProvider value={{ user, userClasses }}>
                    {children}
                </ClassProvider>
            </SidebarProvider>
        </EventsProvider>
    );
}
