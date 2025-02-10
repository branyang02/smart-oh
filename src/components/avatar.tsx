import {
    AvatarFallback,
    AvatarImage,
    Avatar as ShadAvatar
} from "@/components/ui/avatar";
import { User } from "@/types";

function stringToColor(letter: string) {
    // Ensure the input is a single English letter (A-Z, case-insensitive)
    const normalizedLetter = letter.toUpperCase().charAt(0);
    if (!/[A-Z]/.test(normalizedLetter)) {
        throw new Error("Input must be a single English letter (A-Z).");
    }

    // Predefined set of distinct and visually appealing colors
    const colorMap: { [key: string]: string } = {
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

    return colorMap[normalizedLetter];
}

function stringAvatar(name: string) {
    return {
        color: stringToColor(name[0]),
        initials: `${name[0]}`
    };
}

export default function Avatar({
    user,
    status
}: {
    user: User;
    status?: "active" | "inactive";
}) {
    if (user.image) {
        return (
            <ShadAvatar status={status} className="border-2 border-background">
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback
                    style={{
                        backgroundColor: `${stringAvatar(user.name).color}`
                    }}
                >
                    {stringAvatar(user.name).initials}
                </AvatarFallback>
            </ShadAvatar>
        );
    }

    return (
        <ShadAvatar status={status} className="border-2 border-background">
            <AvatarFallback
                style={{
                    backgroundColor: `${stringAvatar(user.name).color}`
                }}
            >
                {stringAvatar(user.name).initials}
            </AvatarFallback>
        </ShadAvatar>
    );
}
