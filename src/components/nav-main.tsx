"use client";

import Avatar from "@/components/avatar";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { useClass } from "@/context/class-context";

export function NavMain({ activeUserIds = [] }: { activeUserIds?: string[] }) {
    const { courseStaff, activeClass } = useClass();
    if (!activeClass)
        return (
            <SidebarGroup>
                <SidebarGroupLabel>
                    Join/Create a course to continue!
                </SidebarGroupLabel>
            </SidebarGroup>
        );

    const tas = courseStaff
        .filter((staff) => staff.role === "TA")
        .sort((a, b) => {
            const aActive = activeUserIds.includes(a.user.userId);
            const bActive = activeUserIds.includes(b.user.userId);
            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;
            return a.user.name.localeCompare(b.user.name);
        });
    const instructors = courseStaff
        .filter((staff) => staff.role === "instructor")
        .sort((a, b) => {
            const aActive = activeUserIds.includes(a.user.userId);
            const bActive = activeUserIds.includes(b.user.userId);
            if (aActive && !bActive) return -1;
            if (!aActive && bActive) return 1;
            return a.user.name.localeCompare(b.user.name);
        });

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>TAs</SidebarGroupLabel>
                <SidebarMenu className="overflow-scroll max-h-[calc(50vh-4rem)]">
                    {tas.map((ta) => (
                        <SidebarMenuItem key={ta.user.userId} className="h-7">
                            <SidebarMenuButton
                                asChild
                                className="h-auto hover:bg-transparent pointer-events-none"
                            >
                                <span className="flex items-center gap-4">
                                    <Avatar
                                        user={ta.user}
                                        {...(activeUserIds.includes(
                                            ta.user.userId
                                        ) && { status: "active" })}
                                    />
                                    <span>{ta.user.name}</span>
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Instructors</SidebarGroupLabel>
                <SidebarMenu>
                    {instructors.map((instructor) => (
                        <SidebarMenuItem
                            key={instructor.user.userId}
                            className="h-10"
                        >
                            <SidebarMenuButton
                                asChild
                                className="h-auto hover:bg-transparent pointer-events-none"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        user={instructor.user}
                                        {...(activeUserIds.includes(
                                            instructor.user.userId
                                        ) && { status: "active" })}
                                    />{" "}
                                    {instructor.user.name}
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
