import { redirect } from "next/navigation";

export default function HomePage() {
    redirect(`/class`);
    return null;
}
