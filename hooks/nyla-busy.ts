import prisma from "@/app/lib/db";
import {Day} from "@prisma/client";
import {notFound} from "next/navigation";
import {nylas} from "@/app/lib/nylas";
import {AnyTime, fromAbsolute, getLocalTimeZone, now, parseTime, toTime} from "@internationalized/date";



const days:Day[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
interface TimeSlotProps {
    fromTime: AnyTime
    tillTime: AnyTime
}

function isBetween (check : AnyTime, from: AnyTime , to: AnyTime){
    if (check.compare(from) > 0 && to.compare(check) > 0){
        return true
    }else{
        return false
    }
}


export async function getData(userName: string , selectedDate: Date, duration: number) {
    const index = selectedDate.getDay()
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
    if (!data) {
        return notFound();
    }
    const nylasCalendarData = await nylas.calendars.getFreeBusy({
        identifier: data.grantId as string,
        requestBody: {
            startTime: Math.floor(startOfDay.getTime() / 1000),
            endTime: Math.floor(endOfDay.getTime() / 1000),
            emails: [data.grantEmail as string]
        }
    })

    const busySlots : TimeSlotProps[] = [];
    const allSlots : AnyTime[] = [];


    //to convert time from unix code
    function convertNylas() {
        nylasCalendarData.data[0].timeSlots.forEach(slot => {
            busySlots.push({
                fromTime: toTime(fromAbsolute(slot.startTime * 1000, getLocalTimeZone())),
                tillTime: toTime(fromAbsolute(slot.endTime * 1000, getLocalTimeZone()))
            })
        })
    }

    convertNylas();

    //converting availability time for that day as set by user
    const availableTime: TimeSlotProps = {
        fromTime: parseTime(data.availability[0].fromTime),
        tillTime: parseTime(data.availability[0].tillTime)
    }


    //created all possible time slots within the available time of the day at a gap of 15 minutes
    let currSlot = availableTime.fromTime;
    while (availableTime.tillTime.compare(currSlot.add({minutes: duration})) > 0) {
        allSlots.push(currSlot);
        currSlot = currSlot.add({minutes: 15});
    }


    //Filtering out time slots and before current time
    const today = new Date();

    const freeSlots = allSlots.filter((slot) => {
        const slotEnd = slot.add({minutes: duration});

        // If checking for tomorrow (no time constraint, only busy slots matter)
        if (selectedDate > today) {
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


    return freeSlots

}
