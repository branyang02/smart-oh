"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { createAndJoinClass, joinClassFromClassId } from "@/db/classes";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const joinClassSchema = z.object({
    classCode: z.string().min(1, "Class code is required")
});

const createClassSchema = z.object({
    name: z.string().min(1, "Course name is required"),
    number: z.string().min(1, "Course number is required"),
    semester: z.string().min(1, "Semester is required")
});

function generateSemesterOptions() {
    const currentYear = new Date().getFullYear();
    const semesters = ["Fall", "Winter", "Spring", "Summer"];
    const options: string[] = [];

    for (let year = currentYear; year <= currentYear + 1; year++) {
        semesters.forEach((semester) => {
            options.push(`${semester} ${year}`);
        });
    }

    return options;
}

export function ClassForms({ user }: { user: User }) {
    const joinForm = useForm<z.infer<typeof joinClassSchema>>({
        resolver: zodResolver(joinClassSchema),
        defaultValues: {
            classCode: ""
        }
    });

    const createForm = useForm<z.infer<typeof createClassSchema>>({
        resolver: zodResolver(createClassSchema),
        defaultValues: {
            name: "",
            number: "",
            semester: ""
        }
    });

    async function onJoinSubmit(values: z.infer<typeof joinClassSchema>) {
        console.log("Join class:", values);
        await joinClassFromClassId(user.id, values.classCode, "student");
    }

    async function onCreateSubmit(values: z.infer<typeof createClassSchema>) {
        console.log("Create class:", values);
        await createAndJoinClass(
            user.id,
            values.name,
            values.number,
            values.semester
        );
    }

    const semesterOptions = generateSemesterOptions();

    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8 mx-auto px-4">
            {/* Join Class Form */}
            <div className="w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Join Class</h2>
                <Form {...joinForm}>
                    <form
                        onSubmit={joinForm.handleSubmit(onJoinSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={joinForm.control}
                            name="classCode"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter class code"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Join Class</Button>
                        </div>
                    </form>
                </Form>
            </div>

            {/* Create Class Form */}
            <div className="w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Create Class</h2>
                <Form {...createForm}>
                    <form
                        onSubmit={createForm.handleSubmit(onCreateSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={createForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Machine Learning"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course Number</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="CS 4774"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={createForm.control}
                            name="semester"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Semester</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select semester" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {semesterOptions.map((semester) => (
                                                <SelectItem
                                                    key={semester}
                                                    value={semester}
                                                >
                                                    {semester}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit">Create Class</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
