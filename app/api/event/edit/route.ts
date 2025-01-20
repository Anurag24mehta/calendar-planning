import {auth} from "@/app/lib/auth";
import {NextResponse} from "next/server";
import {z} from "zod";
import prisma from "@/app/lib/db";

const editEventSchema = z.object({
    title: z.string(),
    url: z.string(),
    description: z.string(),
    duration: z.number(),
    videoCallSoftware: z.enum(["Google Meet", "Zoom Meeting", "Microsoft Teams"]),
    id: z.string()
})

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }
    try{
        const data = await req.json();
        const result = editEventSchema.safeParse(data);
        if(!result.success){
            return NextResponse.json({error: result.error.errors}, {status: 400});
        }
        const event = await prisma.eventType.update({
            where: {
                id: result.data.id
            },
            data: {
                title: result.data.title,
                url: result.data.url,
                description: result.data.description,
                duration: result.data.duration,
                videoCallSoftware: result.data.videoCallSoftware
            }

        })
        if(!event){
            return NextResponse.json({error: "Something went wrong with database"}, {status: 500});
        }
        return NextResponse.json({data: "success"}, {status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({error: "Something went wrong"}, {status: 500});
    }
}