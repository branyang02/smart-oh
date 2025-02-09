import {
    getCachedClassFromClassId,
    getCachedInstructorsFromClassId,
    getCachedTAsFromClassId,
    getCachedUserClassesFromUserId
} from "@/cache";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { getUser } from "@/utils/user-utils";
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

    const [userClasses, courseTAs, courseInstructors, activeClass] =
        await Promise.all([
            getCachedUserClassesFromUserId(user.id),
            getCachedTAsFromClassId(classId),
            getCachedInstructorsFromClassId(classId),
            getCachedClassFromClassId(classId)
        ]);

    if (!activeClass) throw new Error(`Class not found: ${classId}`);
    if (!userClasses.some((c) => c.id === classId)) {
        throw new Error(`You do not have access to class: ${classId}`);
    }

    // TODO: Dummy active user ids
    const activeUserIds = [
        "user-ta2",
        "user-ta3",
        "user-ta4",
        "user-ta8",
        "user-instructor1",
        "user-instructor2"
    ];

    return (
        <ClassProvider
            value={{ userClasses, courseTAs, courseInstructors, activeClass }}
        >
            <AppSidebar user={user} activeUserIds={activeUserIds} />
            <SidebarInset>{children}</SidebarInset>
        </ClassProvider>
    );
}
