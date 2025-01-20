import prisma from "@/app/lib/db";
import {nylas} from "@/app/lib/nylas";
import {NextResponse} from "next/server";
import {auth} from "@/app/lib/auth";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try {
        const userData = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                grantId: true,
                grantEmail: true
            }
        })
        if(!userData){
            return NextResponse.json({error: "User not found"}, {status: 401});
        }

        const data = await nylas.events.list({
            identifier: userData.grantId as string,
            queryParams: {
                calendarId: userData.grantEmail as string,
            },
        })
        if (!data) {
            return NextResponse.json({error: "Something went wrong with nylas"}, {status: 500});
        }
        console.log(data)
        return NextResponse.json({data}, {status: 200});
    }catch (error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}


export async function DELETE(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({message: "Unauthorized", status: 401});
    }
    const {eventId} = await req.json();
    try{
        const userData = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
            select: {
                grantId: true,
                grantEmail: true
            }
        })
        if(!userData){
            return NextResponse.json({message: "User not found", status: 401});
        }
        const data = await nylas.events.destroy({
            eventId: eventId,
            identifier: userData.grantId as string,
            queryParams: {
                calendarId: userData.grantEmail as string,
            },
        })
        if (!data) {
            return NextResponse.json({message: "Something went wrong with nylas", status: 500});
        }
        return NextResponse.json({message: data, status: 200});
    }catch (error){
        console.error(error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }
}