import { dragUser, useDragObserver } from "@/hooks/useDragUser";
import { User } from "@/types";

import { QueuePosition } from "./queue-position";

export type DraggableQueueProps = {
    queueId: string;
    queueName: string;
    users: User[];
};

export const DraggableQueue = ({
    queueId,
    queueName,
    users
}: DraggableQueueProps) => {
    const drag = useDragObserver();

    const handleDragStart = (user: User, position: number) => {
        dragUser.startDrag({ queueId, queuePosition: position }, user);
    };

    const handleFinishDrag = (position: number) => {
        dragUser.finishDrag({ queueId, queuePosition: position });
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
            className={`w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm flex items-center gap-3 bg-white dark:bg-gray-900 flex flex-col ${isBeingTargeted ? "bg-blue-50" : ""}`}
        >
            <div>{queueName}</div>

            <div className="flex flex-col w-full gap-2">
                {insertingLine}
                {users.map((user, index) => (
                    <QueuePosition
                        key={user.id}
                        position={index}
                        user={user}
                        isPreview={
                            drag.type === "dragging" && drag.user.id === user.id
                        }
                        onDragStart={handleDragStart}
                        onDragOver={handleDragOver}
                        onDragEnd={handleFinishDrag}
                    />
                ))}
            </div>
        </div>
    );
};
