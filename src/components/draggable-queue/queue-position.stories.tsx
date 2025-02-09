import { fn } from "@storybook/test";

import { QueuePosition, QueuePositionProps } from "./queue-position";

export default {
    component: QueuePosition,
    title: "QueuePosition",
    tags: ["autodocs"],
    args: {
        onClickDrag: fn(),
        position: 1,
        user: {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            emailVerified: null,
            image: "https://avatars.githubusercontent.com/u/1?v=4"
        }
    } as QueuePositionProps
};

export const Default = {};

export const BigPosition = {
    args: {
        position: 1000
    }
};

export const NoPicture = {
    args: {
        user: {
            id: "1",
            name: "Test User",
            email: "test@test.com",
            emailVerified: null,
            image: "notfound.abc/xyz"
        }
    }
};
