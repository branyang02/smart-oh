"use client";

import { isSafari } from "@/components/office-hour-room/is-safari";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger
} from "@/components/ui/context-menu";
import { useClass } from "@/context/class-context";
import {
    type Edge,
    attachClosestEdge,
    extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
    draggable,
    dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { Ellipsis, GripVertical, UserIcon } from "lucide-react";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import invariant from "tiny-invariant";

import Avatar from "../avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";
import {
    TCard,
    getCardData,
    getCardDropTargetData,
    isCardData,
    isDraggingACard
} from "./data";
import { isShallowEqual } from "./is-shallow-equal";

type TCardState =
    | {
          type: "idle";
      }
    | {
          type: "is-dragging";
      }
    | {
          type: "is-dragging-and-left-self";
      }
    | {
          type: "is-over";
          dragging: DOMRect;
          closestEdge: Edge;
      }
    | {
          type: "preview";
          container: HTMLElement;
          dragging: DOMRect;
      };

const idle: TCardState = { type: "idle" };

const innerStyles: { [Key in TCardState["type"]]?: string } = {
    idle: `border-2 hover:bg-accent hover:text-accent-foreground`,
    "is-dragging": "opacity-40",
    preview: "border-2 opacity-60"
};

const outerStyles: { [Key in TCardState["type"]]?: string } = {
    // We no longer render the draggable item after we have left it
    // as it's space will be taken up by a shadow on adjacent items.
    // Using `display:none` rather than returning `null` so we can always
    // return refs from this component.
    // Keeping the refs allows us to continue to receive events during the drag.
    "is-dragging-and-left-self": "hidden"
};

export function CardShadow({ dragging }: { dragging: DOMRect }) {
    return (
        <div
            className="flex-shrink-0 rounded border-2 border-dashed border-primary gap-2 px-3 py-1 opacity-40"
            style={{ height: dragging.height }}
        />
    );
}

export function CardDisplay({
    card,
    columnId,
    state,
    draggable,
    outerRef,
    innerRef,
    onLeaveColumn
}: {
    card: TCard;
    columnId?: string;
    state: TCardState;
    draggable?: boolean;
    outerRef?: React.MutableRefObject<HTMLDivElement | null>;
    innerRef?: MutableRefObject<HTMLDivElement | null>;
    onLeaveColumn?: (columnId: string, userId: string) => void;
}) {
    const { user } = useClass();

    const handleLeaveColumn = (userId: string) => {
        if (onLeaveColumn && columnId) {
            onLeaveColumn(columnId, userId);
        }
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger disabled={!draggable}>
                <div
                    ref={outerRef}
                    className={`flex flex-shrink-0 flex-col gap-2 px-3 py-1 ${outerStyles[state.type]}`}
                >
                    {/* Put a shadow before the item if closer to the top edge */}
                    {state.type === "is-over" && state.closestEdge === "top" ? (
                        <CardShadow dragging={state.dragging} />
                    ) : null}

                    <div
                        className={`rounded p-2 ${card.role === "TA" ? "border-green-300" : card.user.id === user.id ? "border-blue-300" : ""} ${draggable ? "cursor-grab" : ""} ${innerStyles[state.type]}`}
                        ref={innerRef}
                        style={
                            state.type === "preview"
                                ? {
                                      width: state.dragging.width,
                                      height: state.dragging.height,
                                      transform: !isSafari()
                                          ? "rotate(4deg)"
                                          : undefined
                                  }
                                : undefined
                        }
                    >
                        <div className="flex items-center gap-2">
                            {draggable && (
                                <Button
                                    variant={"ghost"}
                                    className="p-1 text-secondary-foreground/50 h-auto cursor-grab"
                                >
                                    <span className="sr-only">Move user</span>
                                    {user.id === card.user.id ? (
                                        <UserIcon />
                                    ) : (
                                        <GripVertical />
                                    )}
                                </Button>
                            )}
                            {card.role === "TA" && card.user.id !== user.id && (
                                <p className="p-1 text-secondary-foreground/50 h-auto">
                                    TA
                                </p>
                            )}
                            <Avatar user={card.user} />
                            <div>{card.user.name}</div>
                            {card.user.id === user.id && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="rounded p-1 ml-auto"
                                            aria-label="More actions"
                                        >
                                            <Ellipsis />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleLeaveColumn(user.id)
                                            }
                                            className="hover:cursor-pointer"
                                        >
                                            {`Leave ${columnId === "queue" ? "queue" : "session"}`}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    </div>
                    {/* Put a shadow after the item if closer to the bottom edge */}
                    {state.type === "is-over" &&
                    state.closestEdge === "bottom" ? (
                        <CardShadow dragging={state.dragging} />
                    ) : null}
                </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem
                    onClick={() => handleLeaveColumn(card.user.id)}
                    className="hover:cursor-pointer"
                >
                    {`Remove from ${columnId === "queue" ? "queue" : "session"}`}
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export function Card({
    card,
    columnId,
    onLeaveColumn
}: {
    card: TCard;
    columnId: string;
    onLeaveColumn: (columnId: string, userId: string) => void;
}) {
    const { activeRole, user } = useClass();

    const outerRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const [state, setState] = useState<TCardState>(idle);

    const isDraggable =
        activeRole === "TA" &&
        (user.id === card.user.id || card.role === "student");

    useEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        invariant(outer && inner);

        if (!isDraggable) {
            return;
        }

        return combine(
            draggable({
                element: inner,
                getInitialData: ({ element }) =>
                    getCardData({
                        card,
                        columnId,
                        rect: element.getBoundingClientRect()
                    }),
                onGenerateDragPreview({
                    nativeSetDragImage,
                    location,
                    source
                }) {
                    const data = source.data;
                    invariant(isCardData(data));
                    setCustomNativeDragPreview({
                        nativeSetDragImage,
                        getOffset: preserveOffsetOnSource({
                            element: inner,
                            input: location.current.input
                        }),
                        render({ container }) {
                            // Demonstrating using a react portal to generate a preview
                            setState({
                                type: "preview",
                                container,
                                dragging: inner.getBoundingClientRect()
                            });
                        }
                    });
                },
                onDragStart() {
                    setState({ type: "is-dragging" });
                },
                onDrop() {
                    setState(idle);
                }
            }),
            dropTargetForElements({
                element: outer,
                getIsSticky: () => true,
                canDrop: isDraggingACard,
                getData: ({ element, input }) => {
                    const data = getCardDropTargetData({ card, columnId });
                    return attachClosestEdge(data, {
                        element,
                        input,
                        allowedEdges: ["top", "bottom"]
                    });
                },
                onDragEnter({ source, self }) {
                    if (!isCardData(source.data)) {
                        return;
                    }
                    if (source.data.card.user.id === card.user.id) {
                        return;
                    }
                    const closestEdge = extractClosestEdge(self.data);
                    if (!closestEdge) {
                        return;
                    }

                    setState({
                        type: "is-over",
                        dragging: source.data.rect,
                        closestEdge
                    });
                },
                onDrag({ source, self }) {
                    if (!isCardData(source.data)) {
                        return;
                    }
                    if (source.data.card.user.id === card.user.id) {
                        return;
                    }
                    const closestEdge = extractClosestEdge(self.data);
                    if (!closestEdge) {
                        return;
                    }
                    // optimization - Don't update react state if we don't need to.
                    const proposed: TCardState = {
                        type: "is-over",
                        dragging: source.data.rect,
                        closestEdge
                    };
                    setState((current) => {
                        if (isShallowEqual(proposed, current)) {
                            return current;
                        }
                        return proposed;
                    });
                },
                onDragLeave({ source }) {
                    if (!isCardData(source.data)) {
                        return;
                    }
                    if (source.data.card.user.id === card.user.id) {
                        setState({ type: "is-dragging-and-left-self" });
                        return;
                    }
                    setState(idle);
                },
                onDrop() {
                    setState(idle);
                }
            })
        );
    }, [card, columnId, isDraggable]);
    return (
        <>
            <CardDisplay
                outerRef={outerRef}
                innerRef={innerRef}
                state={state}
                card={card}
                columnId={columnId}
                draggable={isDraggable}
                onLeaveColumn={onLeaveColumn}
            />
            {state.type === "preview"
                ? createPortal(
                      <CardDisplay
                          state={state}
                          card={card}
                          draggable={isDraggable}
                      />,
                      state.container
                  )
                : null}
        </>
    );
}
