import {AvailabilityForm} from "@/components/AvailabilityForm";
import {notFound} from "next/navigation";
import prisma from "@/app/lib/db";
import {auth} from "@/app/lib/auth";

async function getData(userId: string) {
    const data = await prisma.availability.findMany({
        where: {
            userId: userId,
        },
        select: {
            day: true,
            isActive: true,
            fromTime: true,
            tillTime: true
        }
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export default async function AvailabilityPage() {
    const session = await auth();
    const data = await getData(session?.user?.id as string);
    return (
        <div>
            <AvailabilityForm initialData={data}/>
        </div>
    )
}