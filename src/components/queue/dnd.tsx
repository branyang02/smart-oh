import { Board } from "@/components/queue/board";
import { TBoard } from "@/components/queue/data";

import { Button } from "../ui/button";
import { useCurrUser } from "./user-context";

const DummyRoomState: TBoard = {
    classId: "class1",
    allUsers: [
        { id: "student1", name: "Alice Student", type: "student" },
        { id: "student2", name: "Bob Student", type: "student" },
        { id: "student3", name: "Charlie Student", type: "student" },
        { id: "student4", name: "David Student", type: "student" },
        { id: "student5", name: "Eve Student", type: "student" },
        { id: "student6", name: "Frank Student", type: "student" },
        { id: "student7", name: "Grace Student", type: "student" },
        { id: "student8", name: "Hank Student", type: "student" },
        { id: "student9", name: "Ivy Student", type: "student" },
        { id: "ta1", name: "John TA", type: "TA" },
        { id: "ta2", name: "Jane TA", type: "TA" },
        { id: "ta3", name: "Kate TA", type: "TA" }
    ],
    columns: [
        {
            id: "queue",
            title: "Queue",
            cards: [
                { id: "student5", name: "Eve Student", type: "student" },
                { id: "student6", name: "Frank Student", type: "student" },
                { id: "student7", name: "Grace Student", type: "student" },
                { id: "student8", name: "Hank Student", type: "student" },
                { id: "student9", name: "Ivy Student", type: "student" },
                { id: "student10", name: "Jack Student", type: "student" },
                { id: "student11", name: "Kelly Student", type: "student" },
                { id: "student12", name: "Liam Student", type: "student" },
                { id: "student13", name: "Mia Student", type: "student" },
                { id: "student14", name: "Nick Student", type: "student" },
                { id: "student15", name: "Olivia Student", type: "student" },
                { id: "student16", name: "Peter Student", type: "student" },
                { id: "student17", name: "Quinn Student", type: "student" },
                { id: "student18", name: "Rose Student", type: "student" },
                { id: "student19", name: "Sam Student", type: "student" },
                { id: "student20", name: "Tom Student", type: "student" },
                { id: "student21", name: "Uma Student", type: "student" },
                { id: "student22", name: "Vince Student", type: "student" },
                { id: "student23", name: "Wendy Student", type: "student" },
                { id: "student24", name: "Xander Student", type: "student" },
                { id: "student25", name: "Yara Student", type: "student" },
                { id: "student26", name: "Zane Student", type: "student" }
            ]
        },
        {
            id: "session-1",
            title: "session-1",
            cards: [
                { id: "ta1", name: "John TA", type: "TA" },
                { id: "student1", name: "Alice Student", type: "student" },
                { id: "student4", name: "David Student", type: "student" }
            ]
        },
        {
            id: "session-2",
            title: "session-2",
            cards: [
                { id: "ta2", name: "Jane TA", type: "TA" },
                { id: "student3", name: "Charlie Student", type: "student" }
            ]
        },
        {
            id: "session-3",
            title: "session-3",
            cards: [{ id: "ta3", name: "Kate TA", type: "TA" }]
        },
        {
            id: "session-4",
            title: "session-4",
            cards: []
        },
        {
            id: "session-5",
            title: "session-5",
            cards: []
        },
        {
            id: "session-6",
            title: "session-6",
            cards: []
        },
        {
            id: "session-7",
            title: "session-7",
            cards: []
        },
        {
            id: "session-8",
            title: "session-8",
            cards: []
        },
        {
            id: "session-9",
            title: "session-9",
            cards: []
        },
        {
            id: "session-10",
            title: "session-10",
            cards: []
        },
        {
            id: "session-11",
            title: "session-11",
            cards: []
        }
    ]
};

export default function DnD({
    newRoomState,
    handleRoomStateChange
}: {
    newRoomState: TBoard;
    handleRoomStateChange: (newRoomState: TBoard) => void;
}) {
    const { currUser, currUserType } = useCurrUser();

    return (
        <div>
            <Button
                onClick={() => {
                    handleRoomStateChange(DummyRoomState);
                }}
            >
                Use Dummy Data
            </Button>
            {currUserType === "student" && (
                <>
                    <Button
                        onClick={() => {
                            handleRoomStateChange({
                                ...newRoomState,
                                columns: newRoomState.columns.map((column) =>
                                    column.id === "queue"
                                        ? {
                                              ...column,
                                              cards: [
                                                  ...column.cards,
                                                  {
                                                      id: currUser.id,
                                                      name: currUser.name,
                                                      type: currUserType
                                                  }
                                              ]
                                          }
                                        : column
                                )
                            });
                        }}
                    >
                        Join Queue
                    </Button>
                    <Button
                        onClick={() => {
                            handleRoomStateChange({
                                ...newRoomState,
                                columns: newRoomState.columns.map((column) =>
                                    column.id === "queue"
                                        ? {
                                              ...column,
                                              cards: column.cards.filter(
                                                  (card) =>
                                                      card.id !== currUser.id
                                              )
                                          }
                                        : column
                                )
                            });
                        }}
                    >
                        Leave Queue
                    </Button>
                </>
            )}
            {currUserType === "TA" && (
                <>
                    <Button
                        onClick={() => {
                            handleRoomStateChange({
                                ...newRoomState,
                                columns: newRoomState.columns.map((column) =>
                                    column.id === "session-1"
                                        ? {
                                              ...column,
                                              cards: [
                                                  ...column.cards,
                                                  {
                                                      id: currUser.id,
                                                      name: currUser.name,
                                                      type: currUserType
                                                  }
                                              ]
                                          }
                                        : column
                                )
                            });
                        }}
                    >
                        Join Session 1
                    </Button>
                    <Button
                        onClick={() => {
                            handleRoomStateChange({
                                ...newRoomState,
                                columns: newRoomState.columns.map((column) =>
                                    column.id === "session-1"
                                        ? {
                                              ...column,
                                              cards: column.cards.filter(
                                                  (card) =>
                                                      card.id !== currUser.id
                                              )
                                          }
                                        : column
                                )
                            });
                        }}
                    >
                        Leave Session 1
                    </Button>
                </>
            )}
            <Board
                initial={newRoomState}
                handleRoomStateChange={handleRoomStateChange}
            />
        </div>
    );
}
