import { User } from "@/types";
import { useCallback, useSyncExternalStore } from "react";

type DragTarget = {
    queueId: string;
    queuePosition: number;
};

type Drag =
    | {
          type: "none";
      }
    | {
          type: "dragging";
          dragStart: DragTarget;
          dragEnd?: DragTarget;
          user: User;
      };

class DragUserStore {
    listeners: Set<() => void> = new Set();
    onFinishDrag?: (
        user: User,
        dragStart: DragTarget,
        dragEnd: DragTarget
    ) => void;
    drag: Drag = { type: "none" };

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    };

    notify = () => {
        this.listeners.forEach((listener) => listener());
    };

    getDrag = () => {
        return this.drag;
    };

    startDrag = (dragStart: DragTarget, user: User) => {
        this.drag = { type: "dragging", dragStart, user };
        this.notify();
    };

    hoverDrag = (dragEnd: DragTarget) => {
        if (this.drag.type !== "dragging") return;
        this.drag = { ...this.drag, dragEnd };
        this.notify();
    };

    finishDrag = () => {
        if (this.drag.type !== "dragging" || !this.drag.dragEnd) return;
        this.onFinishDrag?.(
            this.drag.user,
            this.drag.dragStart,
            this.drag.dragEnd
        );
        this.drag = { type: "none" };
        this.notify();
    };

    cancelDrag = () => {
        if (this.drag.type !== "dragging") return;
        this.drag = { type: "none" };
        this.notify();
    };
}

const dragUserStore = new DragUserStore();
// TODO: Set the logic for onFinishDrag
dragUserStore.onFinishDrag = (user, dragStart, dragEnd) => {
    console.log(
        `Dragged user ${user.name} from ${dragStart.queueId}:${dragStart.queuePosition} to ${dragEnd.queueId}:${dragEnd.queuePosition}.`
    );
};

document.addEventListener("mouseup", (e) => {
    dragUserStore.finishDrag();
    dragUserStore.cancelDrag();
});

export const useDragObserver = () => {
    const subscribe = useCallback(
        (listener: () => void) => dragUserStore.subscribe(listener),
        []
    );
    const getDrag = useCallback(() => dragUserStore.getDrag(), []);

    const drag = useSyncExternalStore(subscribe, getDrag);

    return drag;
};

export const dragUser = {
    startDrag: dragUserStore.startDrag,
    hoverDrag: dragUserStore.hoverDrag,
    finishDrag: dragUserStore.finishDrag
};
