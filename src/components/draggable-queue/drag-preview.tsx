import { useDragObserver } from "@/hooks/useDragUser";
import { User } from "@/types";
import { useEffect, useState } from "react";

import { QUEUE_ELEMENT_HEIGHT } from "./constants";
import { QueuePosition } from "./queue-position";

export type DragPreviewProps = {
    user?: User;
};

export const DragPreview = () => {
    const drag = useDragObserver();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            setPosition({ x: event.clientX, y: event.clientY });
        };

        if (drag.type === "dragging") {
            window.addEventListener("mousemove", handleMouseMove);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [drag.type]);

    if (drag.type !== "dragging") return null;

    return (
        <div
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                zIndex: 1000, // Should be on top of everything
                pointerEvents: "none",
                userSelect: "none",
                width: 300,
                transform: "rotate(-5deg) translate(-50px, 0px)"
            }}
        >
            <QueuePosition
                height={QUEUE_ELEMENT_HEIGHT}
                position={
                    drag.dragEnd?.queuePosition ?? drag.dragStart.queuePosition
                }
                user={drag.user}
                style={{
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                }}
            />
        </div>
    );
};
