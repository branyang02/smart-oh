import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useEvents } from "@/context/events-context";
import { CalendarEvent } from "@/utils/data";
import { X } from "lucide-react";

import { EventDeleteForm } from "./event-delete-form";
import { EventEditForm } from "./event-edit-form";

interface EventViewProps {
    event?: CalendarEvent;
}

export function EventView({ event }: EventViewProps) {
    const { eventViewOpen, setEventViewOpen } = useEvents();

    return (
        <>
            <AlertDialog open={eventViewOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex flex-row justify-between items-center">
                            <h1>{event?.title}</h1>
                            <AlertDialogCancel
                                onClick={() => setEventViewOpen(false)}
                            >
                                <X className="h-5 w-5" />
                            </AlertDialogCancel>
                        </AlertDialogTitle>
                        <table>
                            <tr>
                                <th>Time:</th>
                                <td>{`${event?.start.toLocaleTimeString()} - ${event?.end.toLocaleTimeString()}`}</td>
                            </tr>
                            <tr>
                                <th>Description:</th>
                                <td>{event?.description}</td>
                            </tr>
                            <tr>
                                <th>Color:</th>
                                <td>
                                    <div
                                        className="rounded-full w-5 h-5"
                                        style={{
                                            backgroundColor:
                                                event?.backgroundColor
                                        }}
                                    ></div>
                                </td>
                            </tr>
                        </table>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <EventDeleteForm id={event?.id} title={event?.title} />
                        <EventEditForm
                            oldEvent={event}
                            event={event}
                            isDrag={false}
                            displayButton={true}
                        />
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
