import { AppHeader } from "@/components/app-header";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";
import { getUser } from "@/utils/user";

import { ClassForms } from "./class-form";

export default async function ClassPage() {
    // This page is only rendered if the user is not in a class
    const user = await getUser();
    // TODO: redirect to prev visited page if user has class

    return (
        <>
            <AppSidebar user={user} />
            <SidebarInset>
                <AppHeader
                    breadcrumbs={[
                        {
                            href: `/class`,
                            label: "Join/Create a Course"
                        }
                    ]}
                />
                <div className="flex flex-1 flex-col min-h-screen">
                    <ClassForms />
                </div>
            </SidebarInset>
        </>
    );
}
