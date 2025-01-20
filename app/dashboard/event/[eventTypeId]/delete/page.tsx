"use client"
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {toast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export default function DeleteEventPage({params} : {params: {eventTypeId: string}}) {
    const router = useRouter();
    const handleDelete = async () =>{
        try {
            const response = await fetch("/api/event/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({eventTypeId: params.eventTypeId}),
            })
            if (!response.ok) {
                throw new Error("Failed to delete event type");
            }
            toast({
                variant: "default",
                title: "Success",
                description: "Event type deleted successfully",
            })
            router.replace("/dashboard");
        }catch (error){
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong, try again",
            })
        }
    }
    return(
        <div className={"flex flex-1 items-center justify-center"}>
            <Card className={"max-w-[450px] w-full"}>
                <CardHeader>
                    <CardTitle>Delete event type</CardTitle>
                    <CardDescription>Are you sure you want to delete this event?</CardDescription>
                </CardHeader>
                <CardFooter className={"w-full flex justify-between"}>
                    <Button variant={"outline"}>
                        <Link href={"/dashboard"}>Cancel</Link>
                    </Button>
                    <Button variant={"destructive"} onClick={handleDelete}>Delete</Button>
                </CardFooter>
            </Card>
        </div>
    )
}