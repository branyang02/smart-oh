"use client";

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { useClass } from "@/context/class-context";
import { Calendar } from "lucide-react";
import Link from "next/link";

export function NavProjects() {
    const { activeClass } = useClass();
    if (!activeClass) return null;

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Others</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href={`/class/${activeClass.classId}/calendar`}>
                        <SidebarMenuButton asChild tooltip="Home">
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
