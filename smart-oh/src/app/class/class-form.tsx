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
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const joinClassSchema = z.object({
    classCode: z.string().min(1, "Class code is required"),
    role: z.enum(["student", "TA"], {
        required_error: "Please select a role"
    })
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
    const { toast } = useToast();
    const router = useRouter();

    const joinForm = useForm<z.infer<typeof joinClassSchema>>({
        resolver: zodResolver(joinClassSchema),
        defaultValues: {
            classCode: "",
            role: "student"
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
        try {
            const res = await joinClassFromClassId(
                user.id,
                values.classCode,
                values.role
            );
            toast({
                title: "Success!",
                description: `You have joined ${res.name}.`
            });
            router.push(`/class/${res.id}`);
        } catch (error) {
            joinForm.setError("classCode", {
                type: "manual",
                message:
                    error instanceof Error
                        ? error.message
                        : "Invalid class code"
            });
            toast({
                title: "Uh oh! Something went wrong.",
                description:
                    error instanceof Error
                        ? error.message
                        : "There was a problem with your request.",
                variant: "destructive"
            });
        }
    }

    async function onCreateSubmit(values: z.infer<typeof createClassSchema>) {
        try {
            const res = await createAndJoinClass(
                user.id,
                values.name,
                values.number,
                values.semester
            );
            toast({
                title: "Success!",
                description: `You have successfully created ${res.name}.`
            });
            router.push(`/class/${res.id}`);
        } catch (error) {
            createForm.setError("name", {
                type: "manual",
                message:
                    error instanceof Error
                        ? error.message
                        : "There was a problem creating the class."
            });
            toast({
                title: "Uh oh! Something went wrong.",
                description:
                    error instanceof Error
                        ? error.message
                        : "There was a problem with your request.",
                variant: "destructive"
            });
        }
    }

    const semesterOptions = generateSemesterOptions();

    return (
        <div className="flex flex-col md:flex-row w-full max-w-4xl gap-8 mx-auto px-4">
            {/* Join Class Form */}
            <div className="w-full md:flex-1 md:max-w-md rounded-lg border p-3 shadow-sm">
                <h2 className="text-2xl font-bold mb-6">
                    Join Class as Student/TA
                </h2>
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
                        <FormField
                            control={joinForm.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="student">
                                                Student
                                            </SelectItem>
                                            <SelectItem value="TA">
                                                TA
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
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
                <h2 className="text-2xl font-bold mb-6">
                    Create Class as Instructor
                </h2>
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
