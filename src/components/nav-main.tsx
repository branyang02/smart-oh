"use client";

import Avatar from "@/components/avatar";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
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

    const tas = courseStaff.filter((staff) => staff.role === "TA");
    const instructors = courseStaff.filter(
        (staff) => staff.role === "instructor"
    );

    return (
        <>
            <SidebarGroup>
                <SidebarGroupLabel>TAs</SidebarGroupLabel>
                <SidebarMenu>
                    {tas.map((ta) => (
                        <SidebarMenuItem key={ta.user.userId}>
                            <div
                                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground
                                    ${activeUserIds.includes(ta.user.userId) ? "border-2 border-green-500" : ""}`}
                            >
                                <Avatar user={ta.user} />
                                <span className="text-sm font-medium">
                                    {ta.user.name}
                                </span>
                            </div>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <SidebarGroup>
                <SidebarGroupLabel>Instructors</SidebarGroupLabel>
                <SidebarMenu>
                    {instructors.map((instructor) => (
                        <SidebarMenuItem key={instructor.user.userId}>
                            <div
                                className={`flex items-center gap-3 p-2 rounded-lg hover:bg-accent hover:text-accent-foreground
                                    ${activeUserIds.includes(instructor.user.userId) ? "border-2 border-green-500" : ""}`}
                            >
                                <Avatar user={instructor.user} />
                                <span className="text-sm font-medium">
                                    {instructor.user.name}
                                </span>
                            </div>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </>
    );
}
