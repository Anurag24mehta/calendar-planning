// export default function NewEventPage(){
//     return(
//         <div className={"w-full h-full flex flex-1 items-center justify-center"}>
//             <p></p>
//         </div>
//     )
// }

"use client"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import * as z from "zod"
import {Button} from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Slider} from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {newEventSchema} from "@/schemas/newEventSchem";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";


export default function MyForm() {
    const {toast} = useToast();
    const router = useRouter();


    const form = useForm < z.infer < typeof newEventSchema >> ({
        resolver: zodResolver(newEventSchema),
        defaultValues: {
            title: "",
            url: "",
            description: "",
            duration: 10,
            videoCallSoftware: "Google Meet"
        }

    })

    async function onSubmit (values: z.infer < typeof newEventSchema > )  {
        try {
            console.log(values);
            const response = await fetch("/api/event/new", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })

            if (response.ok) {
                const data = await response.json();
                if (data.status === 200) {
                    toast({
                        title: "Success",
                        description: "Form submitted successfully redirecting..."
                    })
                    router.push("/dashboard")
                } else{
                    toast({
                        variant: "destructive",
                        title: "Something went wrong",
                        description: "Problem at our end try again!!"
                    })
                }
                form.reset();
            }else{
                toast({
                    variant: "destructive",
                    description: "Something went wrong Try again!!"
                })
            }
        } catch (error) {
            console.error("Form submission error", error);
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200 md:p-8"
            >
                <h1 className="text-2xl font-semibold text-red-600 text-center">Create New Event</h1>

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 font-medium">Title</FormLabel>
                            <FormControl>
                                <Input
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                                    placeholder="30 Minute meeting"
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

                <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 font-medium">URL Slug</FormLabel>
                            <FormControl>
                                <div className="flex rounded-lg shadow-sm">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-600">
                                        CalMarshal.com/
                                    </span>
                                    <Input
                                        className="flex-1 border-gray-300 rounded-none rounded-r-lg focus:ring-red-500 focus:border-red-500"
                                        placeholder="example-url"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 font-medium">Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Join this meeting to meet me!"
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({ field: { value, onChange } }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 font-medium">
                                Duration {value} minutes
                            </FormLabel>
                            <FormControl>
                                <Slider
                                    min={10}
                                    max={60}
                                    step={10}
                                    defaultValue={[10]}
                                    onValueChange={(vals) => {
                                        onChange(vals[0]);
                                    }}
                                    className="mt-2"></Slider>
                            </FormControl>
                            <FormDescription className="text-sm text-gray-500">
                                Select the duration of the meet.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="videoCallSoftware"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-gray-800 font-medium">Video Call Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="border-gray-300 focus:ring-red-500 focus:border-red-500 rounded-lg">
                                        <SelectValue placeholder="Select a call provider for meet" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Google Meet">Google Meet</SelectItem>
                                    <SelectItem value="Zoom Meeting">Zoom</SelectItem>
                                    <SelectItem value="Microsoft Teams">Microsoft Teams</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full py-2 text-white bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg shadow-md"
                >
                    Create Event
                </Button>
            </form>
        </Form>
    );
}

