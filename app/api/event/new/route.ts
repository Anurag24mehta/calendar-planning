import {NextResponse} from "next/server";
import {newEventSchema} from "@/schemas/newEventSchem";
import {auth} from "@/app/lib/auth";
import prisma from "@/app/lib/db";

export async function POST(req: Request) {
    try{
        const data = await req.json();
        console.log(data);
        const result = newEventSchema.safeParse(data);
        if (!result.success){
            return NextResponse.json({message: result.error.errors, status: 400});

        }else{
            const session = await auth();
            if (!session?.user) {
                return NextResponse.json({message: "Unauthorized", status: 401});
            }
            const user =  await prisma.user.update({
                where: {id: session.user.id},
                data: {eventType: {
                    create: {
                        title: data.title,
                        duration: data.duration,
                        url: data.url,
                        description: data.description,
                        videoCallSoftware: data.videoCallSoftware
                    }
                    }}
            })
            if (!user) {
                return NextResponse.json({message: " Something went wrong with updating user", status: 500});
            }
            return NextResponse.json({message: "success", status: 200});
        }

    }catch(error){
        console.error(error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }
}