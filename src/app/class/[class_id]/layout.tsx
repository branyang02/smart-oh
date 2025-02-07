import {
    getCachedClass,
    getCachedCourseStaff,
    getCachedUserClasses
} from "@/cache";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { getUser } from "@/utils/user";
import React from "react";

export default async function ClassLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ class_id: string }>;
}) {
    const user = await getUser();
    const classId = (await params).class_id;

    const [userClasses, courseStaff, activeClass] = await Promise.all([
        getCachedUserClasses(user.userId),
        getCachedCourseStaff(classId),
        getCachedClass(classId)
    ]);

    if (!activeClass) throw new Error(`Class not found: ${classId}`);

    return (
        <ClassProvider value={{ userClasses, courseStaff, activeClass }}>
            <AppSidebar user={user} />
            <SidebarInset>{children}</SidebarInset>
        </ClassProvider>
    );
}
