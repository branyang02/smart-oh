"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { extractInitials } from "@/lib/utils";
import { UserClass } from "@/types";

import { Avatar, AvatarFallback } from "./ui/avatar";

export function NavMain({
    courseStaff,
    activeUserIds = []
}: {
    courseStaff: UserClass[];
    activeUserIds: string[];
}) {
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
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">
                                        {extractInitials(ta.user.name)}
                                    </AvatarFallback>
                                </Avatar>
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
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarFallback className="rounded-lg">
                                        {extractInitials(instructor.user.name)}
                                    </AvatarFallback>
                                </Avatar>
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
