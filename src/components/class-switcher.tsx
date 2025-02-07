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
import { UserClass } from "@/types";
import {
    BookOpenCheck,
    ChevronsUpDown,
    GraduationCap,
    Plus,
    UserCog2
} from "lucide-react";
import Link from "next/link";

export function ClassSwitcher({
    classes,
    activeClassId
}: {
    classes: UserClass[];
    activeClassId: string;
}) {
    const { isMobile } = useSidebar();
    const activeClass =
        classes.find((cls) => cls.class?.classId === activeClassId) ||
        classes[0];
    // Remove the active class from the list
    classes = classes.filter((cls) => cls.class?.classId !== activeClassId);

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
                                    {activeClass.class?.name}
                                </span>
                                <span className="truncate text-xs">
                                    {activeClass.class?.semester}
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
                            Courses
                        </DropdownMenuLabel>
                        {classes.map((cls) => (
                            <Link
                                key={cls.class?.classId}
                                href={`/class/${cls.class?.classId}`}
                            >
                                <DropdownMenuItem
                                    key={cls.class?.name}
                                    className="gap-2 p-2 cursor-pointer"
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
                                    {cls.class?.name}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                            <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                <Plus className="size-4" />
                            </div>
                            <div className="font-medium text-muted-foreground ">
                                Add class
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
