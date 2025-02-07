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
    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Some title</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                        <Link href={`/class/${activeClass.classId}/calendar`}>
                            <Calendar />
                            <span>Calendar</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
