import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { auth } from "@/lib/auth";
import {
    getClassFromClassId,
    getCourseStaffForClassFromClassId,
    getUserClassesFromUserId
} from "@/lib/classes";
import { User } from "@/types";
import { unstable_cache } from "next/cache";
import React from "react";

const getCachedUserClasses = unstable_cache(
    getUserClassesFromUserId,
    ["user-classes"],
    { revalidate: 3600 }
);
const getCachedCourseStaff = unstable_cache(
    getCourseStaffForClassFromClassId,
    ["course-staff"],
    { revalidate: 3600 }
);
const getCachedClass = unstable_cache(getClassFromClassId, ["class"], {
    revalidate: 60
});

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

    const [userClasses, courseStaff, activeClass] = await Promise.all([
        getCachedUserClasses(user.userId),
        getCachedCourseStaff(classId),
        getCachedClass(classId)
    ]);

    if (!activeClass) throw new Error(`Class not found: ${classId}`);

    return (
        <ClassProvider value={{ userClasses, courseStaff, activeClass }}>
            <AppSidebar
                user={user}
                activeUserIds={[]} // might use this to highlight available TAs
            />
            <SidebarInset>{children}</SidebarInset>
        </ClassProvider>
    );
}
