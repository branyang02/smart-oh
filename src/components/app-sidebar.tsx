"use client";

import { ClassSwitcher } from "@/components/class-switcher";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail
} from "@/components/ui/sidebar";
import mockData from "@/data";
import { User, UserClass } from "@/types";
import * as React from "react";

export function AppSidebar({
    user,
    classes,
    activeClassId,
    courseStaff,
    activeUserIds
}: {
    user: User;
    classes: UserClass[];
    activeClassId: string;
    courseStaff: UserClass[];
    activeUserIds: string[];
}) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <ClassSwitcher
                    classes={classes}
                    activeClassId={activeClassId}
                />
            </SidebarHeader>
            <SidebarContent>
                <NavMain
                    courseStaff={courseStaff}
                    activeUserIds={activeUserIds}
                />
                <NavProjects projects={mockData.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
