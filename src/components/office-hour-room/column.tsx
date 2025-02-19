"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useClass } from "@/context/class-context";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { Copy, Ellipsis, Plus } from "lucide-react";
import { memo, useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Card, CardShadow } from "./card";
import {
    TCardData,
    TColumn,
    getColumnData,
    isCardData,
    isCardDropTargetData,
    isColumnData,
    isDraggingACard,
    isDraggingAColumn
} from "./data";
import { blockBoardPanningAttr } from "./data-attributes";
import { EditableTitle } from "./editable-title";
import { isShallowEqual } from "./is-shallow-equal";
import { SettingsContext } from "./settings-context";

type TColumnState =
    | {
          type: "is-card-over";
          isOverChildCard: boolean;
          dragging: DOMRect;
      }
    | {
          type: "is-column-over";
      }
    | {
          type: "idle";
      }
    | {
          type: "is-dragging";
      };

const stateStyles: { [Key in TColumnState["type"]]: string } = {
    idle: "",
    "is-card-over": "border-2 border-primary",
    "is-dragging": "opacity-40",
    "is-column-over": "bg-slate-900"
};

const idle = { type: "idle" } satisfies TColumnState;

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardList = memo(function CardList({ column }: { column: TColumn }) {
    return column.cards.map((card) => (
        <Card key={card.user.id} card={card} columnId={column.id} />
    ));
});

export function Column({
    column,
    onRemoveColumn,
    onEditColumnTitle
}: {
    column: TColumn;
    onRemoveColumn: (columnId: string) => void;
    onEditColumnTitle: (columnId: string, newTitle: string) => void;
}) {
    const { user } = useClass();
    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const outerFullHeightRef = useRef<HTMLDivElement | null>(null);
    const headerRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const { settings } = useContext(SettingsContext);
    const [state, setState] = useState<TColumnState>(idle);

    useEffect(() => {
        const outer = outerFullHeightRef.current;
        const scrollable = scrollableRef.current;
        const header = headerRef.current;
        const inner = innerRef.current;
        invariant(outer);
        invariant(scrollable);
        invariant(header);
        invariant(inner);

        const data = getColumnData({ column });

        function setIsCardOver({
            data,
            location
        }: {
            data: TCardData;
            location: DragLocationHistory;
        }) {
            const innerMost = location.current.dropTargets[0];
            const isOverChildCard = Boolean(
                innerMost && isCardDropTargetData(innerMost.data)
            );

            const proposed: TColumnState = {
                type: "is-card-over",
                dragging: data.rect,
                isOverChildCard
            };
            // optimization - don't update state if we don't need to.
            setState((current) => {
                if (isShallowEqual(proposed, current)) {
                    return current;
                }
                return proposed;
            });
        }

        return combine(
            dropTargetForElements({
                element: outer,
                getData: () => data,
                canDrop({ source }) {
                    return (
                        isDraggingACard({ source }) ||
                        isDraggingAColumn({ source })
                    );
                },
                getIsSticky: () => true,
                onDragStart({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location });
                    }
                },
                onDragEnter({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location });
                        return;
                    }
                    if (
                        isColumnData(source.data) &&
                        source.data.column.id !== column.id
                    ) {
                        setState({ type: "is-column-over" });
                    }
                },
                onDropTargetChange({ source, location }) {
                    if (isCardData(source.data)) {
                        setIsCardOver({ data: source.data, location });
                        return;
                    }
                },
                onDragLeave({ source }) {
                    if (
                        isColumnData(source.data) &&
                        source.data.column.id === column.id
                    ) {
                        return;
                    }
                    setState(idle);
                },
                onDrop() {
                    setState(idle);
                }
            }),
            autoScrollForElements({
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false;
                    }

                    return isDraggingACard({ source });
                },
                getConfiguration: () => ({
                    maxScrollSpeed: settings.columnScrollSpeed
                }),
                element: scrollable
            }),
            unsafeOverflowAutoScrollForElements({
                element: scrollable,
                getConfiguration: () => ({
                    maxScrollSpeed: settings.columnScrollSpeed
                }),
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false;
                    }

                    if (!settings.isOverflowScrollingEnabled) {
                        return false;
                    }

                    return isDraggingACard({ source });
                },
                getOverflow() {
                    return {
                        forTopEdge: {
                            top: 1000
                        },
                        forBottomEdge: {
                            bottom: 1000
                        }
                    };
                }
            })
        );
    }, [column, settings]);

    function handleRemoveColumn() {
        onRemoveColumn(column.id);
    }

    return (
        <div
            className="flex flex-shrink-0 select-none flex-col"
            ref={outerFullHeightRef}
        >
            <div
                className={`flex max-h-[calc(100vh-10rem)] flex-col rounded-lg bg-primary-foreground border-2 ${stateStyles[state.type]}`}
                ref={innerRef}
                {...{ [blockBoardPanningAttr]: true }}
            >
                {/* Extra wrapping element to make it easy to toggle visibility of content when a column is dragging over */}
                <div
                    className={`flex max-h-full flex-col ${state.type === "is-column-over" ? "invisible" : ""}`}
                >
                    <div
                        className="flex flex-row items-center justify-between p-3"
                        ref={headerRef}
                    >
                        <EditableTitle
                            title={column.title}
                            onTitleChange={(newTitle) =>
                                onEditColumnTitle(column.id, newTitle)
                            }
                            isEditable={column.id !== "queue"}
                        />
                        {column.id !== "queue" && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="rounded h-6 w-6 p-1"
                                        aria-label="More actions"
                                    >
                                        <Ellipsis />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem
                                        onClick={handleRemoveColumn}
                                        className="hover:cursor-pointer"
                                    >
                                        Remove Session
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                    <div
                        className="flex flex-col overflow-y-auto pb-2 [overflow-anchor:none] [scrollbar-color:theme(colors.slate.600)_theme(colors.slate.700)] [scrollbar-width:thin] "
                        ref={scrollableRef}
                    >
                        <CardList column={column} />
                        {state.type === "is-card-over" &&
                        !state.isOverChildCard ? (
                            <div className="flex-shrink-0 px-3 py-1">
                                <CardShadow dragging={state.dragging} />
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
}
