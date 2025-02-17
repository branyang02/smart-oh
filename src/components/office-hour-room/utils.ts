import { Active, DataRef, Over } from "@dnd-kit/core";
import { UserDragData } from "./user-card";
import { ColumnDropData } from "./board-column";

export function hasDraggableData<T extends Active | Over>(
    entry: T | null | undefined
): entry is T & {
    data: DataRef<UserDragData>;
} {
    if (!entry) {
        return false;
    }
    const data = entry.data.current;
    if (data?.type === "user") return true;
    return false;
}

export function hasDroppableData<T extends Over>(
    entry: T | null | undefined
): entry is T & {
    data: DataRef<UserDragData | ColumnDropData>;
} {
    if (!entry) {
        return false;
    }
    const data = entry.data.current;
    if (data?.type === "user" || data?.type === "column") return true;
    return false;
}