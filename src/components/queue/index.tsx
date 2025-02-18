import { User } from "@/types";
import { useEffect, useRef, useState } from "react";

import DnD from "../queue/dnd";
import { TBoard } from "./data";
import { SettingsContextProvider } from "./settings-context";
import { CurrUserProvider } from "./user-context";

const OfficeHourRoom = ({
    currClassId,
    currUserType,
    currUser
}: {
    currClassId: string;
    currUserType: "student" | "TA";
    currUser: User;
}) => {
    const wsRef = useRef<WebSocket | null>(null);
    const [roomState, setRoomState] = useState<TBoard | null>(null);

    useEffect(() => {
        const wsUrl = `ws://localhost:8000/ws/${currClassId}`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connected for class:", currClassId);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.error) {
                    console.error("Server error:", data.error);
                } else {
                    setRoomState(data);
                }
            } catch (err) {
                console.error("Failed to parse message", err);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        wsRef.current = socket;

        return () => {
            socket.close();
        };
    }, [currClassId]);

    const sendBoardUpdate = (updatedBoard: TBoard) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(updatedBoard));
        }
    };

    const handleRoomStateChange = (newRoomState: TBoard) => {
        setRoomState(newRoomState);
        sendBoardUpdate(newRoomState);
    };

    if (!roomState) {
        return <div>Loading…</div>;
    }

    return (
        <SettingsContextProvider>
            <CurrUserProvider value={{ currUser, currUserType }}>
                <DnD
                    newRoomState={roomState!}
                    handleRoomStateChange={handleRoomStateChange}
                />
            </CurrUserProvider>
        </SettingsContextProvider>
    );
};

export default OfficeHourRoom;
