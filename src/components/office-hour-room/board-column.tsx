import { WSColumn, WSRoomState, WSUser } from "@/components/office-hour-room";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";

import { UserCard } from "./user-card";

export interface ColumnDropData {
    type: "column";
    column: WSColumn;
}

export function BoardColumn({
    column,
    users,
    isOverlay
}: {
    column: WSColumn;
    users: WSUser[];
    isOverlay?: boolean;
}) {
    const userIds = users.map((user) => user.id);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: column.id,
        data: {
            type: "column",
            column: column
        } satisfies ColumnDropData,
        attributes: {
            roleDescription: `This is column with id: ${column.id}`
        }
    });
    const style = {
        transition,
        transform: CSS.Translate.toString(transform)
    };
    const variants = cva(
        "bg-primary-foreground flex flex-col flex-shrink-0 min-h-[200px]",
        {
            variants: {
                dragging: {
                    default: "border-2 border-transparent",
                    over: "ring-2 opacity-30",
                    overlay: "ring-2 ring-primary"
                }
            }
        }
    );

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={variants({
                dragging: isOverlay
                    ? "overlay"
                    : isDragging
                      ? "over"
                      : undefined
            })}
        >
            <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
                <span className="ml-auto">
                    {column.title} ({users.length})
                </span>
            </CardHeader>
            <ScrollArea>
                <CardContent className="flex flex-grow flex-col gap-2 p-2">
                    <SortableContext items={userIds}>
                        {users.map((user) => (
                            <UserCard key={user.id} user={user} />
                        ))}
                    </SortableContext>
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
