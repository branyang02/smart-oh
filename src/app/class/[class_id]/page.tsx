import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import mockData from "@/data";
import { auth } from "@/lib/auth";
import { ClassItem } from "@/types/index";

export default async function ClassPage() {
    const session = await auth();
    const user = {
        name: session?.user?.name || "Guest",
        email: session?.user?.email || "guest@example.com"
    };

    // const classes: ClassItem[] = [];
    const classes: ClassItem[] = mockData.classes;

    return (
        <>
            <AppSidebar user={user} classes={classes} />
            <SidebarInset>
                <AppHeader
                    breadcrumbs={[
                        { href: "/class", label: "Join/Create Course" }
                    ]}
                />
                <div className="flex flex-1 flex-col items-center min-h-screen">
                    <h1>Hi</h1>
                </div>
            </SidebarInset>
        </>
    );
}
