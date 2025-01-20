"use client";
import { useEffect, useState } from "react";
import { AnyTime, Time } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import {useData} from "@/app/lib/bookingContext";

interface TimeTableProps {
    selectedDate: Date;
    userName: string;
    duration: number;
}

export function TimeTablePage({ selectedDate, userName, duration }: TimeTableProps) {
    const { setTime } = useData();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(selectedDate);

    const [data, setData] = useState<AnyTime[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTime, setSelectedTime] = useState<string>("");

    function handleSlotClick(slot: AnyTime) {
        const formattedSlot = new Time(slot.hour, slot.minute).toString().slice(0, 5);
        setSelectedTime(formattedSlot);// Update selectedTime state
        setTime(formattedSlot);
        // const newQuery = new URLSearchParams(window.location.search);
        // newQuery.set("time", formattedSlot);
        // router.replace(`?${newQuery.toString()}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch("/api/booking/nyla-busy-slot", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ userName, selectedDate, duration }),
                });
                const result = await response.json();
                if (result.status === 200) {
                    setData(result.message);
                } else {
                    setData([]);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userName, selectedDate, duration]);

    return (
        <div>
            <p className={"text-base font-semibold"}>{formattedDate}</p>
            <div className={"mt-3 max-h-[350px] overflow-y-auto"}>
                {loading ? (
                    <div className="flex items-center justify-center py-4">
                        <Loader className="animate-spin text-red-500" size={40} />
                    </div>
                ) : data.length > 0 ? (
                    data.map((slot, index) => {
                        const slotStart = new Time(slot.hour, slot.minute).toString().slice(0, 5);
                        const slotEnd = new Time(slot.hour, slot.minute).add({ minutes: duration }).toString().slice(0, 5);
                        const isSelected = selectedTime === slotStart; // Check if this slot is selected

                        return (
                            <Button
                                className={`w-full mb-2  ${
                                    isSelected ? "bg-red-400" : "hover:bg-red-50"
                                }`}
                                variant="outline"
                                key={index}
                                onClick={() => handleSlotClick(slot)}
                            >
                                {slotStart} - {slotEnd}
                            </Button>
                        );
                    })
                ) : (
                    <p>No available time slots</p>
                )}
            </div>
        </div>
    );
}
