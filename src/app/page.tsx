import { redirect } from "next/navigation";

export default function HomePage() {
    // TODO: Fetch classes from API, redirect to /class if not found, redirect to /class/[most_recent_class_id]

    redirect(`/class/ml4774`);
    return null;
}
