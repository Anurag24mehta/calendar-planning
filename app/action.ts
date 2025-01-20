"use server"
import {auth} from "@/app/lib/auth";
import {redirect} from "next/navigation";
import prisma from "@/app/lib/db";
import {nylas} from "@/app/lib/nylas";
import {revalidatePath} from "next/cache";

export async function cancelMeetingActionn(formData : FormData) {
    const session = await auth();
    if (!session?.user) {
        return redirect("/");
    }
    const userData= await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        select: {
            grantId: true,
            grantEmail: true
        },
    })

    if(!userData) {
        throw new Error("User not found");
    }
    console.log(userData);
    console.log(formData.get("eventId"));

    const data = await nylas.events.destroy({
        eventId: formData.get("eventId") as string,
        identifier: userData?.grantId as string,
        queryParams: {
            calendarId: userData?.grantEmail as string,
        },
    });

    revalidatePath("/dashboard/meetings");
}