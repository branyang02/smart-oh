import { dragUser, useDragObserver } from "@/hooks/useDragUser";
import { User } from "@/types";
import { useEffect, useRef, useState } from "react";

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
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);

    useEffect(() => {
        const scrollListener = () => {
            if (queueRef.current === null) return;
            setShowTopFade(queueRef.current.scrollTop !== 0);
            setShowBottomFade(
                queueRef.current.scrollTop + queueRef.current.clientHeight <
                    queueRef.current.scrollHeight
            );
        };
        scrollListener();

        queueRef.current?.addEventListener("scroll", scrollListener);
        return () => {
            queueRef.current?.removeEventListener("scroll", scrollListener);
        };
    }, [queueRef]);

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
                className="h-0 w-full -mt-1 -mb-1 relative"
                style={{ order: drag.dragEnd.queuePosition }}
            >
                <div className="w-full border-t-2 border-blue-500 absolute top-0 left-0" />
            </div>
        ) : null;

    return (
        <div
            className={`
								rounded-lg border p-3 shadow-sm flex items-center gap-3 flex flex-col 
								${isBeingTargeted ? "bg-blue-50 dark:bg-blue-950" : "bg-white dark:bg-gray-900"}
							`}
            onMouseOver={(e) => {
                handleDragOver(users.length);
            }}
            style={{
                width,
                height,
                position: "relative",
                overflow: "hidden",
                boxSizing: "border-box"
            }}
        >
            <div className="font-bold text-gray-600 dark:text-gray-200">
                {queueName}
            </div>

            {users.length === 0 ? (
                <EmptyPosition />
            ) : (
                <div className="w-full h-full relative overflow-hidden">
                    {showTopFade && (
                        <div className="bg-gradient-to-b from-white to-transparent dark:from-gray-900 dark:to-transparent absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none"></div>
                    )}
                    <div
                        ref={queueRef}
                        // Stop any drag events from bubbling to the root div
                        onMouseOver={(e) => e.stopPropagation()}
                        className="top-0 left-0 -right-10 bottom-0 absolute overflow-y-scroll"
                    >
                        <div
                            className="flex flex-col items-center gap-2"
                            style={{
                                width: `${width - 30}px`,
                                height: users.length * 64 + 12
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
                    </div>
                    {showBottomFade && (
                        <div className="bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none"></div>
                    )}
                </div>
            )}
        </div>
    );
};
