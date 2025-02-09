import { dragUser, useDragObserver } from "@/hooks/useDragUser";
import { User } from "@/types";
import { useRef } from "react";

import EmptyPosition from "./empty-position";
import { QueuePosition } from "./queue-position";

export type DraggableQueueProps = {
    queueId: string;
    queueName: string;
    users: User[];
    height: number;
    width: number;
};

export const DraggableQueue = ({
    queueId,
    queueName,
    users,
    width,
    height
}: DraggableQueueProps) => {
    const drag = useDragObserver();
    const queueRef = useRef<HTMLDivElement>(null);

    const handleDragStart = (user: User, position: number) => {
        dragUser.startDrag({ queueId, queuePosition: position }, user);
    };

    const handleDragOver = (position: number) => {
        dragUser.hoverDrag({ queueId, queuePosition: position });
    };

    const isBeingTargeted =
        drag.type === "dragging" && drag.dragEnd?.queueId === queueId;

    // The line to be shown at the position a new user will be inserted
    const insertingLine =
        drag.type === "dragging" && drag.dragEnd?.queueId === queueId ? ( // NB: Can't re-use isBeingTargeted since ts can't infer discriminated union
            <div
                className="border-blue-500"
                style={{
                    order: drag.dragEnd.queuePosition,
                    height: 0,
                    borderTopWidth: "2px",
                    zIndex: 1
                }}
            ></div>
        ) : null;

    return (
        <div
            className={`
								md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm flex items-center gap-3 flex flex-col 
								${isBeingTargeted ? "bg-blue-50 dark:bg-blue-950" : "bg-white dark:bg-gray-900"}
							`}
            onMouseOver={(e) => {
                handleDragOver(users.length);
                e.stopPropagation();
            }}
            style={{
                width,
                height,
                position: "relative",
                overflow: "hidden"
            }}
        >
            <div className="font-bold text-gray-600 dark:text-gray-200">
                {queueName}
            </div>

            {users.length === 0 ? (
                <EmptyPosition />
            ) : (
                <div
                    ref={queueRef}
                    className="flex flex-col w-full gap-2"
                    // Stop any drag events from bubbling to the root div
                    onMouseOver={(e) => e.stopPropagation()}
                    style={{
                        overflowY: "scroll",
                        msOverflowStyle: "auto"
                    }}
                >
                    {insertingLine}
                    {users.map((user, index) => (
                        <QueuePosition
                            key={user.id}
                            position={index}
                            user={user}
                            isPreview={
                                drag.type === "dragging" &&
                                drag.user.id === user.id
                            }
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                        />
                    ))}
                </div>
            )}
            <div
                className="bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent"
                style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 100
                }}
            ></div>
        </div>
    );
};
