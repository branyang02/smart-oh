import { AppHeader } from "@/components/app-header";

import { ClassForms } from "./class-form";

export default async function EmptyClassPage() {
    return (
        <>
            <AppHeader
                breadcrumbs={[{ href: "/class", label: "Join/Create Course" }]}
            />
            <div className="flex flex-1 flex-col items-center min-h-screen">
                <ClassForms />
            </div>
        </>
    );
}
