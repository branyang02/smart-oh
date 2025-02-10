import { dragUser, mouseObject, useDragObserver } from "@/hooks/useDragUser";
import { User } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";

import {
    DRAG_SCROLL_SPEED,
    DRAG_SCROLL_THRESHOLD,
    INSERT_BAR_HEIGHT,
    QUEUE_ELEMENT_GAP,
    QUEUE_ELEMENT_HEIGHT,
    SCROLL_HIDER_OFFSET
} from "./constants";
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
    const scrollDelta = useRef(0);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);
    const [dragPosition, setDragPosition] = useState<number | null>(null);

    const handleScroll = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            setShowTopFade(e.currentTarget.scrollTop !== 0);
            setShowBottomFade(
                e.currentTarget.scrollTop + e.currentTarget.clientHeight <
                    e.currentTarget.scrollHeight
            );
        },
        []
    );

    const handleMouseOver = useCallback(
        (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const queueRect = e.currentTarget.getBoundingClientRect();
            const mouseY = e.clientY - queueRect.top;
            if (mouseY < DRAG_SCROLL_THRESHOLD) {
                scrollDelta.current = mouseY / DRAG_SCROLL_THRESHOLD - 1;
                return;
            }
            if (mouseY > e.currentTarget.clientHeight - DRAG_SCROLL_THRESHOLD) {
                scrollDelta.current =
                    1 -
                    (e.currentTarget.clientHeight - mouseY) /
                        DRAG_SCROLL_THRESHOLD;
                return;
            }
            scrollDelta.current = 0;
        },
        []
    );

    useEffect(() => {
        if (queueRef.current === null) return;

        setShowBottomFade(
            queueRef.current.scrollTop + queueRef.current.clientHeight <
                queueRef.current.scrollHeight
        );

        const interval = setInterval(() => {
            if (
                queueRef.current === null ||
                scrollDelta.current === 0 ||
                !mouseObject.isDown
            )
                return;
            queueRef.current.scrollBy({
                top: scrollDelta.current * DRAG_SCROLL_SPEED,
                behavior: "instant"
            });
        }, 16);

        return () => {
            clearInterval(interval);
        };
    }, [queueRef]);

    const handleDragStart = useCallback(
        (
            _: React.MouseEvent<HTMLDivElement, MouseEvent>,
            user: User,
            position: number
        ) => {
            dragUser.startDrag({ queueId, queuePosition: position }, user);
        },
        []
    );

    const handleDragOver = useCallback(
        (_: React.MouseEvent<HTMLDivElement, MouseEvent>, position: number) => {
            dragUser.hoverDrag({ queueId, queuePosition: position });
        },
        []
    );

    useEffect(() => {
        if (
            drag.type === "dragging" &&
            drag.dragEnd &&
            drag.dragEnd?.queueId === queueId
        ) {
            setDragPosition(drag.dragEnd.queuePosition);
        } else {
            setDragPosition(null);
        }
    }, [drag]);

    return (
        <div
            className={`
								rounded-lg border p-3 shadow-sm flex items-center gap-3 flex flex-col relative box-border overflow-hidden bg-white dark:bg-gray-900
								${dragPosition !== null ? "border-blue-300 dark:border-blue-800" : "border dark:border"}
							`}
            onMouseOver={(e) => {
                // TODO: Add some UI hint to indicate that the user will be placed at the end of the queue.
                handleDragOver(e, users.length);
            }}
            onMouseLeave={() => {
                scrollDelta.current = 0;
            }}
            style={{ width, height }}
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
                        onScroll={handleScroll}
                        onMouseMove={handleMouseOver}
                        // Stop any drag events from bubbling to the root div
                        onMouseOver={(e) => e.stopPropagation()}
                        className="top-0 left-0 -right-10 bottom-0 absolute overflow-y-scroll"
                    >
                        <div
                            // NB: Why do we use an absolute position instead of flex ordering property?
                            // When flex-order changes, the value of offset-top may be unset while the element recomputes its size.
                            // This causes elem.scrollTop += ... to misbehave, resulting in a jumpy autoscroll.
                            className="h-0 w-full -mb-2 absolute z-20"
                            style={{
                                top: `${Math.max((dragPosition ?? 0) * (QUEUE_ELEMENT_HEIGHT + QUEUE_ELEMENT_GAP) - QUEUE_ELEMENT_GAP / 2 - INSERT_BAR_HEIGHT / 2, 0)}px`,
                                opacity: dragPosition !== null ? 1 : 0
                            }}
                        >
                            <div
                                className="w-full border-blue-500 absolute top-0 left-0"
                                style={{
                                    borderTopWidth: INSERT_BAR_HEIGHT
                                }}
                            />
                        </div>
                        <div
                            className="flex flex-col items-center"
                            style={{
                                width: `${width - SCROLL_HIDER_OFFSET}px`, // Used to hide the scrollbar off-screen
                                gap: `${QUEUE_ELEMENT_GAP}px`,
                                paddingBottom:
                                    QUEUE_ELEMENT_GAP + INSERT_BAR_HEIGHT
                            }}
                        >
                            {users.map((user, index) => (
                                <QueuePosition
                                    height={QUEUE_ELEMENT_HEIGHT}
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
