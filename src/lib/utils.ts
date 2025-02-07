import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getDateFromMinutes(minutes: number) {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Set time to midnight
    now.setMinutes(minutes);
    return now;
}

export function extractInitials(name: string) {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("");
}
