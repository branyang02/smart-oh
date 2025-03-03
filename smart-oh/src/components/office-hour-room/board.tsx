"use client";

import { useClass } from "@/context/class-context";
import { autoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { unsafeOverflowAutoScrollForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { CleanupFn } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { reorder } from "@atlaskit/pragmatic-drag-and-drop/reorder";
import { bindAll } from "bind-event-listener";
import { useContext, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";

import { Column } from "./column";
import {
    TBoard,
    TColumn,
    isCardData,
    isCardDropTargetData,
    isColumnData,
    isDraggingACard,
    isDraggingAColumn
} from "./data";
import { blockBoardPanningAttr } from "./data-attributes";
import { SettingsContext } from "./settings-context";

export function Board({
    initial,
    handleRoomStateChange
}: {
    initial: TBoard;
    handleRoomStateChange: (newRoomState: TBoard) => void;
}) {
    const { user, activeRole } = useClass();
    const [data, setData] = useState(initial);

    useEffect(() => {
        setData(initial);
    }, [initial]);

    const scrollableRef = useRef<HTMLDivElement | null>(null);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const element = scrollableRef.current;
        invariant(element);
        return combine(
            monitorForElements({
                canMonitor: isDraggingACard,
                onDrop({ source, location }) {
                    const dragging = source.data;
                    if (!isCardData(dragging)) {
                        return;
                    }

                    const innerMost = location.current.dropTargets[0];

                    if (!innerMost) {
                        return;
                    }
                    const dropTargetData = innerMost.data;
                    const homeColumnIndex = data.columns.findIndex(
                        (column) => column.id === dragging.columnId
                    );
                    const home: TColumn | undefined =
                        data.columns[homeColumnIndex];

                    if (!home) {
                        return;
                    }
                    const cardIndexInHome = home.cards.findIndex(
                        (card) => card.user.id === dragging.card.user.id
                    );

                    // dropping on a card
                    if (isCardDropTargetData(dropTargetData)) {
                        const destinationColumnIndex = data.columns.findIndex(
                            (column) => column.id === dropTargetData.columnId
                        );
                        const destination =
                            data.columns[destinationColumnIndex];
                        // reordering in home column
                        if (home === destination) {
                            const cardFinishIndex = home.cards.findIndex(
                                (card) =>
                                    card.user.id === dropTargetData.card.user.id
                            );

                            // could not find cards needed
                            if (
                                cardIndexInHome === -1 ||
                                cardFinishIndex === -1
                            ) {
                                return;
                            }

                            // no change needed
                            if (cardIndexInHome === cardFinishIndex) {
                                return;
                            }

                            const closestEdge =
                                extractClosestEdge(dropTargetData);

                            const reordered = reorderWithEdge({
                                axis: "vertical",
                                list: home.cards,
                                startIndex: cardIndexInHome,
                                indexOfTarget: cardFinishIndex,
                                closestEdgeOfTarget: closestEdge
                            });

                            const updated: TColumn = {
                                ...home,
                                cards: reordered
                            };
                            const columns = Array.from(data.columns);
                            columns[homeColumnIndex] = updated;
                            setData({ ...data, columns });
                            handleRoomStateChange({ ...data, columns });
                            return;
                        }

                        // moving card from one column to another

                        // unable to find destination
                        if (!destination) {
                            return;
                        }

                        const indexOfTarget = destination.cards.findIndex(
                            (card) =>
                                card.user.id === dropTargetData.card.user.id
                        );

                        const closestEdge = extractClosestEdge(dropTargetData);
                        const finalIndex =
                            closestEdge === "bottom"
                                ? indexOfTarget + 1
                                : indexOfTarget;

                        // remove card from home list
                        const homeCards = Array.from(home.cards);
                        homeCards.splice(cardIndexInHome, 1);

                        // insert into destination list
                        const destinationCards = Array.from(destination.cards);
                        destinationCards.splice(finalIndex, 0, dragging.card);

                        const columns = Array.from(data.columns);
                        columns[homeColumnIndex] = {
                            ...home,
                            cards: homeCards
                        };
                        columns[destinationColumnIndex] = {
                            ...destination,
                            cards: destinationCards
                        };
                        const allUsers = data.allUsers.map((card) =>
                            card.user.id === dragging.card.user.id
                                ? {
                                      ...card,
                                      user: {
                                          ...card.user,
                                          currentColumnId: destination.id
                                      }
                                  }
                                : card
                        );

                        setData({
                            ...data,
                            columns,
                            allUsers
                        });
                        handleRoomStateChange({
                            ...data,
                            columns,
                            allUsers
                        });
                        return;
                    }

                    // dropping onto a column, but not onto a card
                    if (isColumnData(dropTargetData)) {
                        const destinationColumnIndex = data.columns.findIndex(
                            (column) => column.id === dropTargetData.column.id
                        );
                        const destination =
                            data.columns[destinationColumnIndex];

                        if (!destination) {
                            return;
                        }

                        // dropping on home
                        if (home === destination) {
                            // move to last position
                            const reordered = reorder({
                                list: home.cards,
                                startIndex: cardIndexInHome,
                                finishIndex: home.cards.length - 1
                            });

                            const updated: TColumn = {
                                ...home,
                                cards: reordered
                            };
                            const columns = Array.from(data.columns);
                            columns[homeColumnIndex] = updated;
                            setData({ ...data, columns });
                            handleRoomStateChange({ ...data, columns });
                            return;
                        }

                        // remove card from home list
                        const homeCards = Array.from(home.cards);
                        homeCards.splice(cardIndexInHome, 1);

                        // insert into destination list
                        const destinationCards = Array.from(destination.cards);
                        destinationCards.splice(
                            destination.cards.length,
                            0,
                            dragging.card
                        );

                        const columns = Array.from(data.columns);
                        columns[homeColumnIndex] = {
                            ...home,
                            cards: homeCards
                        };
                        columns[destinationColumnIndex] = {
                            ...destination,
                            cards: destinationCards
                        };
                        const allUsers = data.allUsers.map((card) =>
                            card.user.id === dragging.card.user.id
                                ? {
                                      ...card,
                                      user: {
                                          ...card.user,
                                          currentColumnId: destination.id
                                      }
                                  }
                                : card
                        );
                        setData({
                            ...data,
                            columns,
                            allUsers
                        });
                        handleRoomStateChange({
                            ...data,
                            columns,
                            allUsers
                        });
                        return;
                    }
                }
            }),
            monitorForElements({
                canMonitor: isDraggingAColumn,
                onDrop({ source, location }) {
                    const dragging = source.data;
                    if (!isColumnData(dragging)) {
                        return;
                    }

                    const innerMost = location.current.dropTargets[0];

                    if (!innerMost) {
                        return;
                    }
                    const dropTargetData = innerMost.data;

                    if (!isColumnData(dropTargetData)) {
                        return;
                    }

                    const homeIndex = data.columns.findIndex(
                        (column) => column.id === dragging.column.id
                    );
                    const destinationIndex = data.columns.findIndex(
                        (column) => column.id === dropTargetData.column.id
                    );

                    if (homeIndex === -1 || destinationIndex === -1) {
                        return;
                    }

                    if (homeIndex === destinationIndex) {
                        return;
                    }

                    const reordered = reorder({
                        list: data.columns,
                        startIndex: homeIndex,
                        finishIndex: destinationIndex
                    });
                    const allUsers = data.allUsers.map((card) =>
                        card.user.currentColumnId === dragging.column.id
                            ? {
                                  ...card,
                                  user: {
                                      ...card.user,
                                      currentColumnId: dropTargetData.column.id
                                  }
                              }
                            : card
                    );
                    setData({
                        ...data,
                        columns: reordered,
                        allUsers
                    });
                    handleRoomStateChange({
                        ...data,
                        columns: reordered,
                        allUsers
                    });
                }
            }),
            autoScrollForElements({
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false;
                    }

                    return (
                        isDraggingACard({ source }) ||
                        isDraggingAColumn({ source })
                    );
                },
                getConfiguration: () => ({
                    maxScrollSpeed: settings.boardScrollSpeed
                }),
                element
            }),
            unsafeOverflowAutoScrollForElements({
                element,
                getConfiguration: () => ({
                    maxScrollSpeed: settings.boardScrollSpeed
                }),
                canScroll({ source }) {
                    if (!settings.isOverElementAutoScrollEnabled) {
                        return false;
                    }

                    if (!settings.isOverflowScrollingEnabled) {
                        return false;
                    }

                    return (
                        isDraggingACard({ source }) ||
                        isDraggingAColumn({ source })
                    );
                },
                getOverflow() {
                    return {
                        forLeftEdge: {
                            top: 1000,
                            left: 1000,
                            bottom: 1000
                        },
                        forRightEdge: {
                            top: 1000,
                            right: 1000,
                            bottom: 1000
                        }
                    };
                }
            })
        );
    }, [data, settings, handleRoomStateChange]);

    // Panning the board
    useEffect(() => {
        let cleanupActive: CleanupFn | null = null;
        const scrollable = scrollableRef.current;
        invariant(scrollable);

        function begin({ startX }: { startX: number }) {
            let lastX = startX;

            const cleanupEvents = bindAll(
                window,
                [
                    {
                        type: "pointermove",
                        listener(event) {
                            const currentX = event.clientX;
                            const diffX = lastX - currentX;

                            lastX = currentX;
                            scrollable?.scrollBy({ left: diffX });
                        }
                    },
                    // stop panning if we see any of these events
                    ...(
                        [
                            "pointercancel",
                            "pointerup",
                            "pointerdown",
                            "keydown",
                            "resize",
                            "click",
                            "visibilitychange"
                        ] as const
                    ).map((eventName) => ({
                        type: eventName,
                        listener: () => cleanupEvents()
                    }))
                ],
                // need to make sure we are not after the "pointerdown" on the scrollable
                // Also this is helpful to make sure we always hear about events from this point
                { capture: true }
            );

            cleanupActive = cleanupEvents;
        }

        const cleanupStart = bindAll(scrollable, [
            {
                type: "pointerdown",
                listener(event) {
                    if (!(event.target instanceof HTMLElement)) {
                        return;
                    }
                    // ignore interactive elements
                    if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
                        return;
                    }

                    begin({ startX: event.clientX });
                }
            }
        ]);

        return function cleanupAll() {
            cleanupStart();
            cleanupActive?.();
        };
    }, []);

    function handleAddColumn() {
        const newId = String(Date.now());
        const newColumn = {
            id: newId,
            title: newId,
            cards: []
        };
        const newColumns = [...data.columns, newColumn];

        handleRoomStateChange({ ...data, columns: newColumns });
    }

    function handleRemoveColumn(columnId: string) {
        data.allUsers.forEach((card) => {
            if (card.user.currentColumnId === columnId) {
                card.user.currentColumnId = undefined;
            }
        });
        const newColumns = data.columns.filter(
            (column) => column.id !== columnId
        );

        handleRoomStateChange({ ...data, columns: newColumns });
    }

    function handleEditColumnTitle(columnId: string, newTitle: string) {
        const newColumns = data.columns.map((column) =>
            column.id === columnId ? { ...column, title: newTitle } : column
        );

        handleRoomStateChange({ ...data, columns: newColumns });
    }

    function handleJoinColumn(columnId: string) {
        const newAllUsers = data.allUsers.map((card) =>
            card.user.id === user.id
                ? { ...card, user: { ...card.user, currentColumnId: columnId } }
                : card
        );

        const newColumns = data.columns.map((column) =>
            column.id === columnId
                ? {
                      ...column,
                      cards: [
                          ...column.cards,
                          {
                              user: user,
                              role: activeRole!
                          }
                      ]
                  }
                : column
        );

        handleRoomStateChange({
            ...data,
            allUsers: newAllUsers,
            columns: newColumns
        });
    }

    function handleLeaveColumn(columnId: string, userId: string) {
        const newAllUsers = data.allUsers.map((card) =>
            card.user.currentColumnId === columnId && card.user.id === userId
                ? {
                      ...card,
                      user: { ...card.user, currentColumnId: undefined }
                  }
                : card
        );

        const newColumns = data.columns.map((column) =>
            column.id === columnId
                ? {
                      ...column,
                      cards: column.cards.filter(
                          (card) => card.user.id !== user.id
                      )
                  }
                : column
        );

        handleRoomStateChange({
            ...data,
            allUsers: newAllUsers,
            columns: newColumns
        });
    }

    const userCurrentColumnId = data.allUsers.find(
        (card) => card.user.id === user.id
    )?.user.currentColumnId;

    return (
        <div className="flex h-full flex-col">
            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-3 overflow-y-auto [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${
                    settings.isBoardMoreObvious
                        ? "rounded border-2 border-dashed"
                        : ""
                }`}
                ref={scrollableRef}
            >
                {data.columns.map((column) => (
                    <Column
                        key={column.id}
                        column={column}
                        userCurrentColumnId={userCurrentColumnId}
                        onRemoveColumn={handleRemoveColumn}
                        onEditColumnTitle={handleEditColumnTitle}
                        onJoinColumn={handleJoinColumn}
                        onLeaveColumn={handleLeaveColumn}
                    />
                ))}
                {activeRole !== "student" && (
                    <div
                        className="opacity-0 hover:opacity-100 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4
             transition-colors hover:bg-secondary cursor-pointer"
                        onClick={handleAddColumn}
                    >
                        <div className="text-secondary-foreground">
                            Create New Session
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
