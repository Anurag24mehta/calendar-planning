"use client";
import {useState} from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {onboardingSchema} from "@/schemas/onboardingSchema";
import { useRouter } from "next/navigation";
import {toast} from "@/hooks/use-toast";

type FormValues = z.infer<typeof onboardingSchema>;

export default function MyForm() {
    const router = useRouter();
    const form = useForm<FormValues>({
        resolver: zodResolver(onboardingSchema),
    });
    const[isSubmitting,setIsSubmitting] = useState(false);
    // const [username, setUsername] = useState("");
    // const [isUsernameUnique, setIsUsernameUnique] = useState(true);
    //
    // // Debounced function to check username uniqueness after 500ms
    // const checkUsernameUniqueness = debounce(async (value: string) => {
    //     if (value.length < 3) {
    //         setIsUsernameUnique(true); // Reset if input is less than 3 characters
    //         return;
    //     }
    //
    //     try {
    //         const response = await fetch(`/api/check-user-unique?username=${value}`);
    //         const { isUnique , message} = await response.json();
    //         setIsUsernameUnique(isUnique);
    //         console.log(message);
    //     } catch (error) {
    //         console.error("Error checking username uniqueness", error);
    //         setIsUsernameUnique(false); // Set to false on error
    //     }
    // }, 500);

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/onboard", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                throw new Error("Failed to submit form");
            }
            const { status } = await response.json();
            if (status === 200) {
                router.push("/dashboard");
            }else{
                throw new Error("Failed to submit form");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            toast({
                title: "Error",
                description: "Failed to submit form",
                variant: "destructive",
            })
        }finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-xl w-full bg-white rounded-lg shadow-md p-8">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Welcome to <span className="text-red-600">CalMarshal</span>
                </h1>
                <p className="text-gray-600 mt-2 mb-6">
                    We need the following information to set up your profile!
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Full Name Field */}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Full Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-sm text-gray-500">
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium text-gray-700">
                                        Username
                                    </FormLabel>
                                    <FormControl>
                                        <div className="mt-1 flex rounded-md shadow-sm">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600 text-sm">
                                                CalMarshal.com/
                                            </span>
                                            <Input
                                                className={`flex-1 block w-full border-gray-300 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Enter your username"
                                                type="text"
                                                {...field}
                                                // value={username}
                                                // onChange={(e) => {
                                                //     setUsername(e.target.value);
                                                //     checkUsernameUniqueness(e.target.value);
                                                // }}
                                            />
                                        </div>
                                    </FormControl>
                                    {/*{!isUsernameUnique && (*/}
                                    {/*    <FormMessage className="text-red-500">*/}
                                    {/*        Username is already taken.*/}
                                    {/*    </FormMessage>*/}
                                    {/*)}*/}
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-red-500 text-white hover:bg-red-700 focus:ring-2 focus:ring-blue-500 focus:outline-none py-2 rounded-lg font-medium text-sm"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Continue"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
