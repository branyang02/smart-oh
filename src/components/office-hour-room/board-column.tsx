import { WSRoomState, WSSession, WSUser } from "@/components/office-hour-room";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";

import { UserCard } from "./user-card";

export interface ColumnDragData {
    type: "column";
    data: WSUser[];
}

export function BoardColumn({
    session,
    queue,
    isOverlay
}: {
    session?: WSSession;
    queue?: WSUser[];
    isOverlay?: boolean;
}) {
    if (session && queue) {
        throw new Error("Only one of 'session' or 'queue' should be provided.");
    }
    if (!session && !queue) {
        throw new Error("Either 'session' or 'queue' must be provided.");
    }

    let userIds: string[] = [];
    if (session) userIds = session.users.map((user) => user.id);
    if (queue) userIds = queue.map((student) => student.id);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: session ? session.id : "queue",
        data: {
            type: "column",
            data: session ? session.users : queue!
        } satisfies ColumnDragData,
        attributes: {
            roleDescription: `This is Session with id: ${session ? session.id : "queue"}`
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
                    {session ? "Session " + session.id : "Queue"}
                </span>
            </CardHeader>
            <ScrollArea>
                <CardContent className="flex flex-grow flex-col gap-2 p-2">
                    <SortableContext items={userIds}>
                        {session
                            ? session.users.map((user) => (
                                  <UserCard key={user.id} user={user} />
                              ))
                            : queue?.map((user) => (
                                  <UserCard key={user.id} user={user} />
                              ))}
                    </SortableContext>
                </CardContent>
            </ScrollArea>
        </Card>
    );
}
