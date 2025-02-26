"use client";

import { ClassForms } from "@/app/class/class-form";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
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
import { useClass } from "@/context/class-context";
import { User } from "@/types";
import Cookies from "js-cookie";
import {
    BookOpenCheck,
    ChevronsUpDown,
    GraduationCap,
    Plus,
    UserCog2
} from "lucide-react";
import Link from "next/link";

function RoleIcon({ role }: { role: string | undefined }) {
    switch (role) {
        case "student":
            return <GraduationCap className="size-4 shrink-0" />;
        case "TA":
            return <BookOpenCheck className="size-4 shrink-0" />;
        case "instructor":
            return <UserCog2 className="size-4 shrink-0" />;
        default:
            return <BookOpenCheck className="size-4 shrink-0" />;
    }
}

export function ClassSwitcher({ user }: { user: User }) {
    const { activeClass, userClasses } = useClass();
    const { isMobile } = useSidebar();

    if (!activeClass) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <RoleIcon role={"student"} />
                            </div>
                            SmartOH
                        </SidebarMenuButton>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        );
    }

    const currRole = userClasses.find((cls) => cls.id === activeClass.id)?.role;

    // Remove the active class from the list
    const selectableUserClasses = userClasses.filter(
        (cls) => cls.id !== activeClass.id
    );

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
                                <RoleIcon role={currRole} />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-semibold">
                                    {activeClass.name}
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
                            Courses
                        </DropdownMenuLabel>
                        {selectableUserClasses.map((cls) => (
                            <Link
                                key={cls.id}
                                href={`/class/${cls.id}`}
                                onClick={() => {
                                    Cookies.set("lastVisitedClassId", cls.id, {
                                        expires: 7
                                    });
                                }}
                            >
                                <DropdownMenuItem
                                    key={cls.name}
                                    className="gap-2 p-2 cursor-pointer"
                                >
                                    <div className="flex size-6 items-center justify-center rounded-sm border">
                                        <RoleIcon role={cls.role} />
                                    </div>
                                    {cls.name}
                                </DropdownMenuItem>
                            </Link>
                        ))}
                        <DropdownMenuSeparator />
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    className="gap-2 p-2 cursor-pointer"
                                    onSelect={(e) => {
                                        e.preventDefault();
                                    }}
                                >
                                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                                        <Plus className="size-4" />
                                    </div>
                                    <div className="font-medium text-muted-foreground ">
                                        Add a Course
                                    </div>
                                </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="max-w-4xl">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Join or Create a Course
                                    </AlertDialogTitle>
                                </AlertDialogHeader>
                                <ClassForms user={user} />
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
