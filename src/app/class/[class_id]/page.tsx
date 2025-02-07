import { AppHeader } from "@/components/app-header";

export default async function ClassPage({
    params
}: {
    params: Promise<{ class_id: string }>;
}) {
    const class_id = (await params).class_id;
    // const classTitle = getClassTitleFromId(class_id);
    const classTitle = "Machine Learning";

    return (
        <>
            <AppHeader
                breadcrumbs={[
                    { href: `/class/${class_id}`, label: classTitle }
                ]}
            />
            <div className="flex flex-1 flex-col items-center min-h-screen">
                <h1>Class Page</h1>
            </div>
        </>
    );
}
