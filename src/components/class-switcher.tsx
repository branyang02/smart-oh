"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "@/components/ui/sidebar";
import { ClassItem } from "@/types";
import {
    BookOpenCheck,
    ChevronsUpDown,
    GraduationCap,
    Plus,
    UserCog2
} from "lucide-react";
import * as React from "react";

const getLastSelectedClass = (classes: ClassItem[]) => {
    const lastSelectedClassName = localStorage.getItem("lastSelectedClass");
    if (lastSelectedClassName) {
        const lastSelectedClass = classes.find(
            (cls) => cls.className === lastSelectedClassName
        );
        return lastSelectedClass || classes[0]; // Fallback to the first class if not found
    }
    return classes[0]; // Default to the first class
};

export function ClassSwitcher({ classes }: { classes: ClassItem[] }) {
    const { isMobile } = useSidebar();
    const [activeClass, setActiveClass] = React.useState<ClassItem | null>(
        null
    );

    React.useEffect(() => {
        setActiveClass(getLastSelectedClass(classes));
    }, [classes]);

    const handleClassChange = (cls: ClassItem) => {
        setActiveClass(cls);
        localStorage.setItem("lastSelectedClass", cls.className);
    };

    if (classes.length === 0 || !activeClass) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Plus className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                Add class
                            </span>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                {(() => {
                                    switch (activeClass.role) {
                                        case "student":
                                            return (
                                                <GraduationCap className="size-4 shrink-0" />
                                            );
                                        case "TA":
                                            return (
                                                <BookOpenCheck className="size-4 shrink-0" />
                                            );
                                        case "instructor":
                                            return (
                                                <UserCog2 className="size-4 shrink-0" />
                                            );
                                        default:
                                            return (
                                                <BookOpenCheck className="size-4 shrink-0" />
                                            );
                                    }
                                })()}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeClass.className}
                                </span>
                                <span className="truncate text-xs">
                                    {activeClass.semester}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Teams
                        </DropdownMenuLabel>
                        {classes.map((cls) => (
                            <DropdownMenuItem
                                key={cls.className}
                                onClick={() => handleClassChange(cls)}
                                className="gap-2 p-2"
                            >
                                <div className="flex size-6 items-center justify-center rounded-sm border">
                                    {(() => {
                                        switch (cls.role) {
                                            case "student":
                                                return (
                                                    <GraduationCap className="size-4 shrink-0" />
                                                );
                                            case "TA":
                                                return (
                                                    <BookOpenCheck className="size-4 shrink-0" />
                                                );
                                            case "instructor":
                                                return (
                                                    <UserCog2 className="size-4 shrink-0" />
                                                );
                                            default:
                                                return (
                                                    <BookOpenCheck className="size-4 shrink-0" />
                                                );
                                        }
                                    })()}
                                </div>
                                {cls.className}
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground">
                                Add class
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
