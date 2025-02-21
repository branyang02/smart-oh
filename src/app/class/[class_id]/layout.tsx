import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { ClassProvider } from "@/context/class-context";
import { getClassFromClassId, getUserClassesFromUserId } from "@/db/classes";
import { getInstructorsFromClassId, getTAsFromClassId } from "@/db/users";
import { getUser } from "@/utils/user-utils";
import { cookies } from "next/headers";
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

    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get("authjs.session-token");
    const sessionToken = sessionCookie?.value ?? "";

    const [userClasses, courseTAs, courseInstructors, activeClass] =
        await Promise.all([
            getUserClassesFromUserId(user.id),
            getTAsFromClassId(classId),
            getInstructorsFromClassId(classId),
            getClassFromClassId(classId)
        ]);

    if (!activeClass) {
        throw new Error(`Class not found: ${classId}`);
    }

    const userClass = userClasses.find((c) => c.id === classId);
    if (!userClass) {
        throw new Error(`You do not have access to class: ${classId}`);
    }

    const activeRole = userClass.role;

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
            value={{
                user,
                userClasses,
                courseTAs,
                courseInstructors,
                activeClass,
                activeRole,
                sessionToken
            }}
        >
            <AppSidebar user={user} activeUserIds={activeUserIds} />
            <SidebarInset>{children}</SidebarInset>
        </ClassProvider>
    );
}
