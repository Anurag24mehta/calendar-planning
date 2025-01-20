"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export function MenuActiveSwitch({
                                     initialChecked,
                                     eventTypeId,
                                 }: {
    initialChecked: boolean;
    eventTypeId: string;
}) {
    const [active, setActive] = useState(initialChecked);

    const updateActive = async (newActive: boolean) => {
        // Optimistically update the UI
        setActive(newActive);

        try {
            const response = await fetch(`/api/event/edit/active`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ eventTypeId, isChecked: newActive }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to update event status");

            }

            toast({
                variant: "default",
                title: "Success",
                description: "Event activity updated",
            });
        } catch (error) {
            console.error(error);
            // Revert the state if the request fails
            setActive(!newActive);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update event status",
            });
        }
    };

    return (
        <Switch
            checked={active}
            onCheckedChange={(newActive) => {
                updateActive(newActive);
            }}
        />
    );
}
