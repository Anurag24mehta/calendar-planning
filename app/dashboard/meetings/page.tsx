"use client"

import {EmptyState} from "@/components/EmptyState";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Loader, Video} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {toast} from "@/hooks/use-toast";
import useSWR, {mutate} from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
export default function MeetingsRoute(){
    const {data,error,isLoading} = useSWR("/api/meeting", fetcher);

    if (isLoading){
        return(
            <div className={"flex items-center justify-center h-screen"}>
                <Loader className={"w-10 h-10 animate-spin"}/>
            </div>
        )
    }

    if (error){
        return(
            <div className={""}>Something went wrong try again later</div>
        )
    }
    
    if (data.data.data.length < 1){
        return(
            <EmptyState
                title={"No meetings found"}
                description={"You don't have any meetings yet"}
                buttonText={"Create a new Event Type"}
                href={"/dashboard/new"}
            />
        )
    }


    const handleCancelMeeting = async (eventId: string)=>{
        try{
            const toastId = toast({
                variant: "default",
                title: "Processing...",
                description: "Canceling your meeting, please wait...",
            });
            const response = await fetch("/api/meeting",{
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({eventId}),
            })
            const result = await response.json();
            toastId.dismiss();
            console.log(result);
            if(result.status == 200){
                toast({
                    variant: "default",
                    title: "Success",
                    description: "Meeting canceled successfully",
                })
                console.log(result.message);
                mutate("/api/meeting");
            }else{
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something went wrong, try again"
                })
                console.error(result.message);
            }
        }catch (error) {
            console.error(error);
        }
    }

    return(
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Bookings</CardTitle>
                    <CardDescription>
                        See upcoming event which were booked with and see the  event type link.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {data.data.data.map((item, index) => (
                        <div key={index} className="grid grid-cols-3 justify-center items-center">
                            <div>
                                <p className="text-muted-foreground text-sm">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        weekday: "short",
                                        day: "2-digit",
                                        month: "long",
                                    }).format(new Date(item.when.startTime * 1000))}
                                </p>
                                <p className="text-muted-foreground text-xs pt-1">
                                    {new Intl.DateTimeFormat("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    }).format(new Date(item.when.startTime * 1000))}{" "}
                                    -{" "}
                                    {new Intl.DateTimeFormat("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    }).format(new Date(item.when.endTime * 1000))}
                                </p>
                                <div className="flex items-center mt-1">
                                    <Video className="size-4 mr-2 text-blue-900" />
                                    <a
                                        className="text-xs text-blue-800 underline underline-offset-4"
                                        href={item.conferencing.details.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Join Meeting
                                    </a>
                                </div>
                            </div>
                            <div className="flex flex-col items-start">
                                <h2 className="text-sm font-medium">{item.title}</h2>
                                <p className="text-sm text-muted-foreground">
                                    You and {item.participants[0].name}
                                </p>
                            </div>
                            <Button
                                className="w-fit flex ml-auto"
                                variant="destructive"
                                onClick={() => handleCancelMeeting(item.id)}
                            >
                                Cancel Event
                            </Button>
                            <Separator className="h-[2px] my-3" orientation="horizontal" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </>
    )
}