import { redirect } from "next/navigation";

export default function HomePage() {
    // TODO: setup redirect based on local storage
    redirect(`/class/${123}`);
    return null;
}
