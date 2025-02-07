import { getCachedUserClasses } from "@/cache";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { EventsProvider } from "@/context/events-context";
import { UserClass } from "@/types";
import { getUser } from "@/utils/user";

export default async function BaseLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const user = await getUser();
    const userClasses: UserClass[] = await Promise.resolve(
        getCachedUserClasses(user.userId)
    );
    const courseStaff: UserClass[] = []; // redefined in [class_id]/layout.tsx

    return (
        <EventsProvider>
            <SidebarProvider>
                <ClassProvider value={{ userClasses, courseStaff }}>
                    {children}
                </ClassProvider>
            </SidebarProvider>
        </EventsProvider>
    );
}
