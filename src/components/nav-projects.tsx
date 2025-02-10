"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { useClass } from "@/context/class-context";
import { Calendar, Settings } from "lucide-react";
import Link from "next/link";

export function NavProjects() {
    const { activeClass } = useClass();
    if (!activeClass) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Others</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href={`/class/${activeClass.id}/settings`}>
                        <SidebarMenuButton asChild tooltip="Settings">
                            <span className="flex items-center gap-2">
                                <Settings />
                                <span>Settings</span>
                            </span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <Link href={`/class/${activeClass.id}/calendar`}>
                        <SidebarMenuButton asChild tooltip="Calendar">
                            <span className="flex items-center gap-2">
                                <Calendar />
                                <span>Calendar</span>
                            </span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
