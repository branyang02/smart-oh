import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import {
    getCourseStaffForClassFromClassId,
    getUserClassesFromUserId
} from "@/lib/classes";
import { User } from "@/types";

export default async function ClassLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ class_id: string }>;
}) {
    const session = await auth();
    const user: User = {
        userId: session?.user?.id || "000",
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com",
        avatarUrl: session?.user?.image || ""
    };

    const classId = (await params).class_id;
    console.log("Fetching user classes from DB...");
    const userClasses = await getUserClassesFromUserId(user.userId);
    const courseStaff = await getCourseStaffForClassFromClassId(classId);

    return (
        <>
            <AppSidebar
                user={user}
                classes={userClasses}
                activeClassId={classId}
                courseStaff={courseStaff}
                activeUserIds={[]}
            />
            <SidebarInset>{children}</SidebarInset>
        </>
    );
}
