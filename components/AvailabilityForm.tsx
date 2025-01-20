"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface AvailabilityFormProps {
    initialData: { day: string; isActive: boolean; fromTime: string; tillTime: string }[];
}

export function AvailabilityForm({ initialData }: AvailabilityFormProps) {
    const { toast } = useToast();

    const [formData, setFormData] = useState(initialData);

    const generateTimeSlots = () => {
        const times = [];
        for (let hour = 0; hour < 24; hour++) {
            const hourStr = hour.toString().padStart(2, "0");
            times.push(`${hourStr}:00`, `${hourStr}:30`);
        }
        return times;
    };

    const timeSlots = generateTimeSlots();

    const handleToggle = (index: number) => {
        const updatedData = [...formData];
        updatedData[index].isActive = !updatedData[index].isActive;
        setFormData(updatedData);
    };

    const handleTimeChange = (
        index: number,
        field: "fromTime" | "tillTime",
        value: string
    ) => {
        const updatedData = [...formData];
        updatedData[index][field] = value;
        setFormData(updatedData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const isValid = formData.every((dayData) => {
            if (dayData.isActive) {
                const from = dayData.fromTime.split(":").map(Number);
                const till = dayData.tillTime.split(":").map(Number);
                return from[0] < till[0] || (from[0] === till[0] && from[1] < till[1]);
            }
            return true;
        });

        if (!isValid) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please ensure 'From Time' is earlier than 'Till Time'.",
            });
            return;
        }

        try {
            const response = await fetch("/api/availability", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Something went wrong. Try again.",
                });
                throw new Error("Failed to submit form");
            }
            toast({
                title: "Success",
                description: "Changes saved successfully",
            });
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Something went wrong. Please try again.",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Set Your Availability
            </h2>
            {formData.map((dayData, index) => (
                <div key={index} className="grid grid-cols-12 items-center gap-6 border-b pb-6">
                    {/* Day Name */}
                    <div className="col-span-3 text-lg font-medium text-gray-700">
                        {dayData.day}
                    </div>

                    {/* Toggle Switch */}
                    <div className="col-span-2 flex justify-center">
                        <div
                            className={`relative inline-flex items-center h-6 rounded-full w-12 cursor-pointer transition-colors ${
                                dayData.isActive ? "bg-red-500" : "bg-gray-300"
                            }`}
                            onClick={() => handleToggle(index)}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                    dayData.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                            ></span>
                        </div>
                    </div>

                    {/* From Time Picker */}
                    <div className="col-span-3">
                        <select
                            value={dayData.fromTime}
                            onChange={(e) =>
                                handleTimeChange(index, "fromTime", e.target.value)
                            }
                            className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={!dayData.isActive} // Disable if not active
                            aria-label={`From Time for ${dayData.day}`} // Added for accessibility
                        >
                            <option value="" disabled>
                                Select Time
                            </option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Till Time Picker */}
                    <div className="col-span-3">
                        <select
                            value={dayData.tillTime}
                            onChange={(e) =>
                                handleTimeChange(index, "tillTime", e.target.value)
                            }
                            className="w-full border-2 border-gray-300 rounded-md px-4 py-2 text-lg focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={!dayData.isActive} // Disable if not active
                            aria-label={`Till Time for ${dayData.day}`} // Added for accessibility
                        >
                            <option value="" disabled>
                                Select Time
                            </option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <button
                type="submit"
                className="mt-4 w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                Save Changes
            </button>
        </form>
    );
}
