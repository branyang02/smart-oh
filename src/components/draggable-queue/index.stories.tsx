import { User } from "@/types";
import { fn } from "@storybook/test";

import { DraggableQueue, DraggableQueueProps } from ".";
import { DragPreview } from "./drag-preview";

const dummyUsers: User[] = [
    {
        id: "1",
        name: "Test User 1",
        email: "test1@test.com",
        emailVerified: null,
        image: "https://avatars.githubusercontent.com/u/1?v=4"
    },
    {
        id: "2",
        name: "Test User 2",
        email: "test2@test.com",
        emailVerified: null,
        image: "https://avatars.githubusercontent.com/u/1?v=4"
    },
    {
        id: "3",
        name: "Test User 3",
        email: "test3@test.com",
        emailVerified: null,
        image: "fakeimage"
    }
];

const dummyUsers2: User[] = [
    {
        id: "4",
        name: "Test User 4",
        email: "test1@test.com",
        emailVerified: null,
        image: "fakeimage"
    },
    {
        id: "5",
        name: "Test User 5",
        email: "test2@test.com",
        emailVerified: null,
        image: "https://avatars.githubusercontent.com/u/1?v=4"
    },
    {
        id: "6",
        name: "Test User 6",
        email: "test3@test.com",
        emailVerified: null,
        image: "fakeimage"
    }
];

const lotsOfUsers = Array.from({ length: 20 }, (_, i) => ({
    id: "l-" + i.toString(),
    name: `Test User ${i + 100}`,
    email: `test${i + 1}@test.com`,
    emailVerified: null,
    image: "https://avatars.githubusercontent.com/u/1?v=4"
}));

export default {
    component: DraggableQueue,
    title: "DraggableQueue",
    tags: ["autodocs"],
    args: {
        queueId: "1",
        queueName: "Test Queue",
        users: dummyUsers,
        height: 500,
        width: 300
    } as DraggableQueueProps
};

export const Default = () => {
    return (
        <div style={{ display: "flex", gap: 20 }}>
            <DragPreview />

            <DraggableQueue
                width={300}
                height={500}
                queueId="1"
                queueName="Test Queue 1"
                users={lotsOfUsers}
            />

            <DraggableQueue
                width={300}
                height={500}
                queueId="2"
                queueName="Test Queue 2"
                users={dummyUsers2}
            />

            <DraggableQueue
                width={300}
                height={500}
                queueId="3"
                queueName="Test Queue 3"
                users={[]}
            />
        </div>
    );
};
