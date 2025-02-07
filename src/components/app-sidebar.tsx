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
import { User } from "@/types";
import * as React from "react";

export function AppSidebar({
    user,
    activeUserIds
}: {
    user: User;
    activeUserIds: string[];
}) {
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <ClassSwitcher />
            </SidebarHeader>
            <SidebarContent>
                <NavMain activeUserIds={activeUserIds} />
                <NavProjects />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
