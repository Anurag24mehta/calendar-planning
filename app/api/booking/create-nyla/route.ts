import {NextResponse} from "next/server";
import prisma from "@/app/lib/db";
import {nylas} from "@/app/lib/nylas";
import {z} from "zod";

const createEventSchema = z.object({
    username: z.string().min(1),
    eventTypeId: z.string(),
    eventDate: z.string(),
    fromTime: z.string(),
    duration: z.number(),
    provider: z.enum(["Google Meet", "Zoom Meeting", "Microsoft Teams"]),
    participants: z.array(
        z.object({
            name: z.string(),
            email: z.string().email(),
        })
    )
})


export async function POST(req: Request) {
    try{
        const data = await req.json();
        console.log(data);
        const validatedData = createEventSchema.safeParse(data);
        if(!validatedData.success){
            return NextResponse.json({message: validatedData.error.errors, status: 400})
        }
        const {username, eventTypeId, eventDate, fromTime, duration, provider, participants} = validatedData.data

        const getUserData = await prisma.user.findUnique({
            where: {
                username: username
            },
            select: {
                grantEmail: true,
                grantId: true
            },
        })
        if(!getUserData){
            return NextResponse.json({message: "User not found", status: 401})
        }
        const eventTypeData = await prisma.eventType.findUnique({
            where: {
                id: eventTypeId
            },
            select: {
                title: true,
                description: true,
            }
        })

        if(!eventTypeData){
            return NextResponse.json({message: "Event type not found", status: 401})
        }

        const startDateTime = new Date(`${eventDate}T${fromTime}:00`);
        const endDateTime = new Date(startDateTime.getTime() + duration*60*1000);

        const event = await nylas.events.create({
            identifier: getUserData.grantId as string,
            requestBody: {
                title: eventTypeData.title,
                description: eventTypeData.description,
                when: {
                    startTime: Math.floor(startDateTime.getTime()/1000),
                    endTime: Math.floor(endDateTime.getTime()/1000),
                },
                conferencing: {
                    autocreate: {},
                    provider: provider,
                },
                participants: participants.map((participant) => ({
                    ...participant,
                        status: "yes"
                }))
            },
            queryParams: {
                calendarId: getUserData.grantEmail as string,
                notifyParticipants: true,

            }
        })

        if(!event){
            return NextResponse.json({message: "Something went wrong with nylas", status: 500})
        }
        return NextResponse.json({message: "Successfully created event",status: 200})
    }catch(error){
        console.log(error);
        return NextResponse.json({message: "Something went wrong", status: 500})
    }
}