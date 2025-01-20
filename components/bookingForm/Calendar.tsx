"use client"
import "@/components/bookingForm/calendar.css";
import React, {useEffect, useState} from "react";
import {
    Button,
    Calendar,
    CalendarCell,
    CalendarGrid,
    Heading,
} from "react-aria-components";
import { MoveLeft, MoveRight } from "lucide-react";
import {
    today,
    getLocalTimeZone,
    DateValue,
    getDayOfWeek,
    isSameDay,

} from "@internationalized/date";
import { useLocale } from "react-aria-components";
import {useData} from "@/app/lib/bookingContext";

// Define a type for the days of the week
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

// Map days of the week to integers
const dayToInt: Record<DayOfWeek, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
};

interface IsActiveProps {
    day: DayOfWeek;
    isActive: boolean;
}


export function CalendarForm({ activity}: { activity: IsActiveProps[] }) {
    const {setDate} = useData();
    const localDate = today(getLocalTimeZone());
    const { locale } = useLocale();
    const [selectedDate, setSelectedDate] = useState(localDate);


    // Helper function to filter inactive days
    function getInactiveDays(activity: IsActiveProps[]) {
        return activity
            .filter(dayObj => !dayObj.isActive) // Filter out inactive days
            .map(dayObj => dayToInt[dayObj.day]!); // Map day names to integers
    }

    const inactiveDayIndices = getInactiveDays(activity);

    // Check if the date is unavailable based on inactive days
    const isDateUnavailable = (date: DateValue) => {
        const dayIndex = getDayOfWeek(date, locale);
        return inactiveDayIndices.includes(dayIndex);
    };

    useEffect(()=>{
        const formattedDate = selectedDate.toString();
        setDate(formattedDate);
        // const url = new URL (window.location.href);
        // url.searchParams.set('date', formattedDate);
        // router.push(url.toString());

    },[selectedDate])


    return (
        <div className={"calendar-container p-4 "}>
            <Calendar
                aria-label="Appointment date"
                value={selectedDate}
                onChange={setSelectedDate}
                minValue={localDate}
                isDateUnavailable={isDateUnavailable}
            >
                <header className="flex items-center justify-between mb-4">
                    <Button slot="previous">
                        <MoveLeft />
                    </Button>
                    <Heading />
                    <Button slot="next">
                        <MoveRight />
                    </Button>
                </header>
                <CalendarGrid>
                    {(date) => (
                        <CalendarCell
                            date={date}
                            className={({ isSelected, date: cellDate, isOutsideMonth, isDisabled }) =>
                                `${
                                    isOutsideMonth
                                        ? "hidden" // Hide cells outside the current month
                                        : isDisabled
                                            ? "calendar-cell calendar-cell-disabled" // Apply disabled style
                                            : isDateUnavailable(date) && isSameDay(cellDate, localDate)
                                                ? "calendar-cell border-2 border-black text-red-500 line-through cursor-not-allowed bg-muted" // Combine styles for unavailable today
                                                : isDateUnavailable(date)
                                                    ? "calendar-cell text-red-500 line-through cursor-not-allowed bg-muted" // Unavailable dates
                                                    : isSelected
                                                        ? "calendar-cell bg-red-400" // Selected cell styling
                                                        : isSameDay(cellDate, localDate)
                                                            ? "calendar-cell border-2 border-black bg-red-50" // Today styling
                                                            : "calendar-cell bg-red-50" // Default cell styling
                                }`
                            }
                        />



                    )}
                </CalendarGrid>
            </Calendar>
        </div>
    );
}
