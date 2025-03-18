import { cn } from "@/lib/utils";
import { User } from "@/types";
import Image from "next/image";

function stringToColor(letter: string) {
    const normalizedLetter = letter.toUpperCase().charAt(0);
    if (!/[A-Z]/.test(normalizedLetter)) return "#CCC"; // Default color

    const colorMap: Record<string, string> = {
        A: "#FF6B6B",
        B: "#4ECDC4",
        C: "#FFEEAD",
        D: "#A8D8EA",
        E: "#FF9AA2",
        F: "#D4A5A5",
        G: "#6BFFB8",
        H: "#FFD166",
        I: "#A5A5D4",
        J: "#B8E986",
        K: "#FF9F7F",
        L: "#83C5BE",
        M: "#FFD1DC",
        N: "#A2DDF0",
        O: "#FFC3A0",
        P: "#D4A5D4",
        Q: "#B5EAD7",
        R: "#FF9A8B",
        S: "#C7CEEA",
        T: "#FFB6C1",
        U: "#A2C8EC",
        V: "#FFCC99",
        W: "#B5EAD7",
        X: "#FF9F9F",
        Y: "#A8E6CF",
        Z: "#FF8B94"
    };

    return colorMap[normalizedLetter] || "#CCC";
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("");
}

export default function Avatar({
    user,
    status
}: {
    user: User;
    status?: "active" | "inactive";
}) {
    const hasImage = Boolean(user.image);
    const backgroundColor = stringToColor(user.name[0]);
    const initials = getInitials(user.name);

    return (
        <div className="relative">
            {hasImage ? (
                <Image
                    src={user.image as string}
                    alt={user.name}
                    width={96}
                    height={96}
                    draggable={false}
                    className="border-2 border-transparent relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
                />
            ) : (
                <div
                    className="border-2 border-transparent flex h-10 w-10 shrink-0 overflow-hidden rounded-full items-center justify-center text-white font-medium uppercase"
                    style={{ backgroundColor }}
                >
                    {initials}
                </div>
            )}
            {status && (
                <span
                    className={cn(
                        "absolute bottom-1 right-1 h-2 w-2 rounded-full border border-background",
                        status === "active" ? "bg-green-500" : "bg-yellow-500"
                    )}
                />
            )}
        </div>
    );
}
