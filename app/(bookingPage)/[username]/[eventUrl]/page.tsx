"use client"

import {useData} from "@/app/lib/bookingContext";
import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";
import {Card, CardContent} from "@/components/ui/card";
import {CalendarX2, Clock, Loader, PlusCircle, VideoIcon, XCircle} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {CalendarForm} from "@/components/bookingForm/Calendar";
import {TimeTablePage} from "@/components/bookingForm/TimeTablePage";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import useSWR from "swr";


interface EventType {
    id: string;
    title: string;
    duration: number;
    description: string;
    videoCallSoftware: string;
}
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface Availability {
    day: DayOfWeek;
    isActive: boolean;
}

interface UserData {
    image: string;
    name: string;
    availability: Availability[];
    eventType: EventType[];
}

interface FormData {
    participants: { name: string; email: string }[]; // Array of objects for name and email
    username: string; // Add username
    eventTypeId: string; // Add eventTypeId
    eventDate: string; // Add eventDate
    fromTime: string; // Add fromTime
    duration: number; // Add duration
    provider: string; // Add provider
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());


export default function BookingPage({params} : {params: {eventUrl: string; username: string}}) {
    const router = useRouter();
    const {date , time}  = useData();

    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(new Date(date));

    const { control, handleSubmit, register } = useForm<FormData>({
        defaultValues: {
            participants: [{ name: "", email: "" }], // Initialize with one empty pair of fields
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "participants", // Name of the field array
    });

    const {data,error,isLoading} = useSWR(`/api/booking/${params.username}/${params.eventUrl}`, fetcher);

    if(isLoading){
        return (
            <div className={"flex items-center justify-center h-screen"}>
                <Loader className={"w-10 h-10 animate-spin"}/>
            </div>
        )
    }

    if(error){
        return (
            <div className={""}>Something went wrong try again later</div>
        )
    }

    const onSubmit = async (formData: FormData) => {
        
        formData.username = params.username;
        formData.eventTypeId = data?.data.eventType[0].id as string;
        formData.eventDate  = date;
        formData.fromTime = time;
        formData.duration = data?.data.eventType[0].duration as number;
        formData.provider = data?.data.eventType[0].videoCallSoftware as string;
        console.log(formData)
        try{
            const toastId = toast({
                variant: "default",
                title: "Processing...",
                description: "Booking your meeting, please wait.",
            });
            const response = await fetch("/api/booking/create-nyla", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            toastId.dismiss()
            console.log(result);
            if(result.status == 200){
                toast({
                    variant: "default",
                    title: "Success",
                    description: result.message,
                })
                router.push("/success")
            }else{
                toast({
                    title: "Error",
                    description: result.message,
                    variant: "destructive",
                })
            }
        }catch(error){
            console.error(error);
        }
    };


    return (
        <div className={"min-h-screen w-screen flex flex-col items-center justify-center"}>
            <Card className={"max-w-[1280px] w-full mx-auto shadow-lg border"}>
                <CardContent className={"p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr,auto,1fr]"}>
                    <div>
                        <img src={data.data.image!} alt={"Profile Image"} className={"w-10 h-10 rounded-full"}/>
                        <p className={"text-sm font-muted text-muted-foreground mt-2"}>{data.data.name}</p>
                        <h1 className={"text-xl font-semibold mt-2"}>{data.data.eventType[0].title}</h1>
                        <p className={"text-sm font-muted text-muted-foreground mt-2"}>{data.data.eventType[0].description}</p>
                        <div className={"mt-5 flex flex-col gap-3"}>
                            <p className={"flex items-center"}>
                                <CalendarX2 className={"size-5 mr-2 text-red-600"}/>
                                <span
                                    className={"text-sm font-medium text-muted-foreground"}>{formattedDate}</span>
                            </p>
                            <p className={"flex items-center"}>
                                <Clock className={"size-5 mr-2 text-red-600"}/>
                                <span
                                    className={"text-sm font-medium text-muted-foreground"}>{data.data.eventType[0].duration} minutes</span>
                            </p>
                            <p className={"flex items-center"}>
                                <VideoIcon className={"size-5 mr-2 text-red-600"}/>
                                <span
                                    className={"text-sm font-medium text-muted-foreground"}>{data.data.eventType[0].videoCallSoftware}</span>
                            </p>
                        </div>
                    </div>
                    <Separator orientation={"vertical"} className={"f-full w-[2px] mx-2"}/>
                    <CalendarForm activity={data.data.availability}/>
                    <Separator orientation={"vertical"} className={"f-full w-[2px] mx-2"}/>
                    <TimeTablePage
                        selectedDate={new Date(date)}
                        userName={params.username}
                        duration={data.data.eventType[0].duration}

                    />
                    <Separator orientation={"vertical"} className={"f-full w-[2px] mx-2"}/>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="min-w-[400px] bg-white shadow-md rounded-lg p-4">
                        <div
                            className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 p-1 max-h-[320px]">
                            <p className={"text-muted-foreground mb-2"}>Enter the detail of participants you
                                want to add</p>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2 mb-2">
                                    {/* Name Input */}
                                    <Input
                                        {...register(`participants.${index}.name`)} // Register the name input with react-hook-form
                                        placeholder="Your Name"
                                        className="w-[40%]" // Adjust width for alignment
                                    />

                                    {/* Email Input */}
                                    <Input
                                        {...register(`participants.${index}.email`)} // Register the email input with react-hook-form
                                        placeholder="Your Email"
                                        className="w-[55%]" // Adjust width for alignment
                                    />

                                    {/* Remove Button */}
                                    <button
                                        type="button"
                                        onClick={() => remove(index)} // Remove the entire pair at the given index
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <XCircle size={20}/>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                            <button
                                type="button"
                                onClick={() => append({name: "", email: ""})} // Append a new pair of fields
                                className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
                            >
                                <PlusCircle size={20}/>
                                <span>Add</span>
                            </button>
                            <Button type="submit" className="ml-auto bg-muted hover:bg-red-300"
                                    variant={"outline"}>
                                Book Meeting
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>

    )
}