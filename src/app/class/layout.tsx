import { getCachedUserClassesFromUserId } from "@/cache";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { EventsProvider } from "@/context/events-context";
import { getUser } from "@/utils/user-utils";

export default async function BaseLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const userClasses = await Promise.resolve(
        getCachedUserClassesFromUserId(user.id)
    );

    return (
        <EventsProvider>
            <SidebarProvider>
                <ClassProvider value={{ userClasses }}>
                    {children}
                </ClassProvider>
            </SidebarProvider>
        </EventsProvider>
    );
}
