import { useEffect } from "react";
import { toast } from "sonner";


export function useTimeValidation({
    departureTime,
    arrivalTime,
    departureDayOffset,
    arrivalDayOffset,
}) {
    useEffect(() => {
        if (!departureTime || !arrivalTime) return;

        // Convert times to minutes for comparison
        const [depHour, depMin] = departureTime.split(":").map(Number);
        const [arrHour, arrMin] = arrivalTime.split(":").map(Number);

        const depMinutes = depHour * 60 + depMin + departureDayOffset * 24 * 60;
        const arrMinutes = arrHour * 60 + arrMin + arrivalDayOffset * 24 * 60;

        if (depMinutes >= arrMinutes) {
            toast({
                variant: "destructive",
                title: "Invalid Time",
                description:
                    "Departure time must be less than arrival time. Please adjust the times or day offsets.",
            });
        }
    }, [departureTime, arrivalTime, departureDayOffset, arrivalDayOffset]);
}
