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
import * as React from "react";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
    user: {
        name: string;
        email: string;
    };
    classes: {
        className: string;
        semester: string;
        role: "student" | "TA" | "instructor";
    }[];
};

export function AppSidebar({ user, classes, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <ClassSwitcher classes={classes} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mockData.navMain} />
                <NavProjects projects={mockData.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
