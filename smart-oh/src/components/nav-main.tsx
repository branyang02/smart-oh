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
    const { courseTAs, courseInstructors, activeClass } = useClass();
    if (!activeClass)
        return (
            <SidebarGroup>
                <SidebarGroupLabel>
                    Join/Create a course to continue!
                </SidebarGroupLabel>
            </SidebarGroup>
        );

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>TAs</SidebarGroupLabel>
                <SidebarMenu className="overflow-scroll max-h-[calc(50vh-4rem)] min-h-[20vh]">
                    {courseTAs?.map((ta) => (
                        <SidebarMenuItem key={ta.id} className="h-7">
                            <SidebarMenuButton
                                asChild
                                className="h-auto hover:bg-transparent pointer-events-none"
                            >
                                <span className="flex items-center gap-4">
                                    <Avatar
                                        user={ta}
                                        {...(activeUserIds.includes(ta.id) && {
                                            status: "active"
                                        })}
                                    />
                                    <span>{ta.name}</span>
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Instructors</SidebarGroupLabel>
                <SidebarMenu>
                    {courseInstructors?.map((instructor) => (
                        <SidebarMenuItem key={instructor.id} className="h-10">
                            <SidebarMenuButton
                                asChild
                                className="h-auto hover:bg-transparent pointer-events-none"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar
                                        user={instructor}
                                        {...(activeUserIds.includes(
                                            instructor.id
                                        ) && { status: "active" })}
                                    />{" "}
                                    {instructor.name}
                                </div>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
