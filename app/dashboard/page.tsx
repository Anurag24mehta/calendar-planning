import {auth} from "@/app/lib/auth";
import {notFound, redirect} from "next/navigation";
import prisma from "@/app/lib/db";
import {EmptyState} from "@/components/EmptyState";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { Switch } from "@/components/ui/switch"; // ShadCN Switch
import {Settings, Calendar, ExternalLink, Link2, Pen, Trash} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {CopyLinkMenu} from "@/components/dashboard/CopyLinkMenu";
import {MenuActiveSwitch} from "@/components/dashboard/EventTypeSwitch";
import {DeleteMenu} from "@/components/dashboard/DeleteMenu";

async function getdata(userId: string) {
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            username: true,
            eventType: {
                select: {
                    id: true,
                    active: true,
                    title: true,
                    url: true,
                    duration: true,
                    description: true
                }
            }
        }
    })
    if (!data) {
        return notFound()
    }
    return data;
}
export default async function DashboardPage(){
    const session = await auth();
    if (!session?.user) {
        return redirect("/");
    }
    const data = await getdata(session.user.id as string);
    return(
        <div>
            {data.eventType.length === 0 ? (
                <EmptyState
                    title={"You have no Event Types"}
                    description={"You can create your first event type by clicking the button below"}
                    buttonText={"Add Event Type"}
                    href={"/dashboard/new"}
                />
            ) : (
                <div className={"grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
                    {data.eventType.map((event: any) => (<div key={event.id}>
                        <Card className="relative border border-red-500 shadow-md rounded-lg hover:shadow-lg transition transform hover:scale-105 max-w-sm">
                            {/* Header Section */}
                            <CardHeader className="bg-red-100 p-4 rounded-t-lg flex items-center flex-row ">
                                <Calendar className="text-red-600 w-8 h-8 mr-4" />
                                <div>
                                    <CardTitle className="text-lg font-semibold text-red-600">{event.title}</CardTitle>
                                    <p className="text-sm text-gray-600">{event.description}</p>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Settings />
                                    </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuGroup>
                                                <DropdownMenuLabel>Event</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem asChild>
                                                    <Link href = {`/${data.username}/${event.url}`}>
                                                        <ExternalLink className={"mr-2 size-4"} />
                                                        Preview
                                                    </Link>
                                                </DropdownMenuItem>
                                                <CopyLinkMenu meetingUrl={`${process.env.NEXT_PUBLIC_URL}/${data.username}/${event.url}`}/>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/dashboard/event/${event.id}`}>
                                                        <Pen className={"mr-2 size-4"}/>Edit
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        <DropdownMenuSeparator/>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/event/${event.id}/delete`}>
                                                    <Trash className={"mr-2 size-4"} />
                                                    Delete
                                                </Link>
                                            </DropdownMenuItem>
                                    </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            {/* Content Section */}
                            <CardContent className="p-4 space-y-2 bg-red-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-700">Duration:</p>
                                    <p className="text-sm font-bold text-red-600">{event.duration} minutes</p>
                                </div>

                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-gray-700">URL Slug:</p>
                                    <a
                                        href={`/${event.url}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-red-600 font-medium underline hover:text-red-800 transition"
                                    >
                                        {event.url}
                                    </a>
                                </div>
                            </CardContent>

                            {/* Footer Section */}
                            <CardFooter className="bg-red-50 p-4 rounded-b-lg flex items-center justify-between">
                                <Button className="bg-red-600 hover:bg-red-700 text-white" asChild>
                                    <Link href={`/dashboard/event/${event.id}`}>
                                        Edit Event
                                    </Link>
                                </Button>
                                <MenuActiveSwitch initialChecked={event.active} eventTypeId={event.id}/>
                            </CardFooter>
                        </Card>
                    </div>))}
                </div>
            )}
        </div>
    )
}