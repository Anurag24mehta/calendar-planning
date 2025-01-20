import {auth} from "@/app/lib/auth";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/db";
import {z} from "zod";
import {NextResponse} from "next/server";

// const DayEnum = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']);
//
// const availabilitySchema = z.object({
//     day: DayEnum,
//     isActive: z.boolean(),
//     fromTime: z.string(),
//     tillTime: z.string(),
// })

interface AvailabilityFormProps {
    initialData: { day: string; isActive: boolean; fromTime: string; tillTime: string }[];
}


export async function POST(req: Request) {
    try{
        const session = await auth();
        if (!session?.user) {
            return redirect("/");
        }
        const data = await req.json();
        console.log(data[0]);
        for (let i = 0;i<7;i++){
            console.log(data[i].day);
            await prisma.user.update({
                where: {
                    id: session.user.id
                },
                data: {
                    availability: {
                        updateMany: {
                            where: {
                                day: data[i].day
                            },
                            data: {
                                isActive: data[i].isActive,
                                fromTime: data[i].fromTime,
                                tillTime: data[i].tillTime
                            }
                        }
                    }
                }
            })
        }
        return NextResponse.json({message: "success", status: 200});
    }catch(error){
        console.error(error);
        return NextResponse.json({message: "Something went wrong", status: 500});
    }
}