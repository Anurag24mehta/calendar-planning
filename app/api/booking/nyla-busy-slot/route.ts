import {NextResponse} from "next/server";
import prisma from "@/app/lib/db";
import {Day} from "@prisma/client";
import {auth} from "@/app/lib/auth";
import {nylas} from "@/app/lib/nylas";
import {fromAbsolute, getLocalTimeZone, now, parseTime, toTime, Time} from "@internationalized/date";

const days:Day[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
interface TimeSlotProps {
    fromTime: Time
    tillTime: Time
}

function isBetween(check: Time, from: Time, to: Time) {
    return check.compare(from) > 0 && to.compare(check) > 0;
}



export async function POST(req: Request) {
    try{
        const {userName,selectedDate,duration} = await req.json();
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({message: "Unauthorized", status: 401});
        }
        const parsedDate = new Date(selectedDate);

        const index = parsedDate.getDay()
        const day = days[index];

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);


        const data = await prisma.user.findUnique({
            where: {
                username: userName
            },
            select: {
                grantEmail: true,
                grantId: true,
                availability: {
                    where: {
                        isActive: true,
                        day: day as Day
                    },
                    select: {
                        isActive: true,
                        fromTime: true,
                        tillTime: true
                    }
                }
            }
        });
        if(!data) {
            return NextResponse.json({message: "User not found", status: 404});
        }
        const nylasCalendarData = await nylas.calendars.getFreeBusy({
            identifier: data.grantId as string,
            requestBody: {
                startTime: Math.floor(startOfDay.getTime() / 1000),
                endTime: Math.floor(endOfDay.getTime() / 1000),
                emails: [data.grantEmail as string]
            }
        });

        if(!nylasCalendarData) {
            return NextResponse.json({message: "Something went wrong with nylas", status: 500});
        }

        const busySlots : TimeSlotProps[] = [];
        const allSlots : Time[] = [];

        
        const timeSlots = (nylasCalendarData.data[0] as any).timeSlots;
        timeSlots.forEach(slot=> {
            busySlots.push({
                fromTime: toTime(fromAbsolute(slot.startTime * 1000, getLocalTimeZone())),
                tillTime: toTime(fromAbsolute(slot.endTime * 1000, getLocalTimeZone()))
            });
        });


        const availableTime: TimeSlotProps = {
            fromTime: parseTime(data.availability[0].fromTime),
            tillTime: parseTime(data.availability[0].tillTime)
        }

        //created all possible time slots within the available time of the day at a gap of 15 minutes
        let currSlot : Time = availableTime.fromTime;
        while (availableTime.tillTime.compare(currSlot.add({minutes: duration})) > 0) {
            allSlots.push(currSlot);
            currSlot = currSlot.add({minutes: 15});
        }


        //Filtering out time slots and before current time
        const today = new Date();

        const freeSlots = allSlots.filter((slot : Time) => {
            const slotEnd = slot.add({minutes: duration});

            // If checking for tomorrow (no time constraint, only busy slots matter)
            if (parsedDate > today) {
                const isSlotFree = !busySlots.some((busySlot) =>
                    isBetween(slot, busySlot.fromTime, busySlot.tillTime) ||
                    isBetween(slotEnd, busySlot.fromTime, busySlot.tillTime) ||
                    (slot.compare(busySlot.fromTime) >= 0 && slotEnd.compare(busySlot.tillTime) <= 0)
                );

                return isSlotFree; // Return the slot if it's free
            }

            // If checking for today (apply the current time constraint)
            if (slot.compare(toTime(now(getLocalTimeZone()))) > 0) {
                const isSlotFree = !busySlots.some((busySlot) =>
                    isBetween(slot, busySlot.fromTime, busySlot.tillTime) ||
                    isBetween(slotEnd, busySlot.fromTime, busySlot.tillTime) ||
                    (slot.compare(busySlot.fromTime) >= 0 && slotEnd.compare(busySlot.tillTime) <= 0)
                );

                return isSlotFree; // Return the slot if it's free
            }

            return false; // Exclude if the slot doesn't meet the criteria
        });
        if (!freeSlots || freeSlots.length === 0) {
            return NextResponse.json({message: "No active availability found for the user", status: 404});
        }
        return NextResponse.json({message: freeSlots, status: 200});

    }catch(error : any){
        return NextResponse.json({message: "Something went wrong: " + error.message, status: 500});

    }
}