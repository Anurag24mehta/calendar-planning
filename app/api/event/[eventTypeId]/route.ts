import {auth} from "@/app/lib/auth";
import {NextRequest, NextResponse} from "next/server";
import prisma from "@/app/lib/db";

export async function GET(req: NextRequest, {params}: {params: {eventTypeId: string}}) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const {eventTypeId} = params;
        const data = await prisma.eventType.findUnique({
            where: {
                id: eventTypeId
            },
            select: {
                title: true,
                duration: true,
                description: true,
                videoCallSoftware: true,
                url: true,
                id: true
            }
        })
        if (!data) {
            return NextResponse.json({error: "Event not found"}, {status: 404});
        }
        return NextResponse.json(data, {status: 200});

    }catch(error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}