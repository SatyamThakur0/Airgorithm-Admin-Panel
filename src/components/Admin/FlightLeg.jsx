import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Trash2 } from "lucide-react";
import { AutocompleteInput } from "./AutoCompleteInput";
import { ClassPriceFactors } from "./ClassPriceFactor";
import { useTimeValidation } from "./TimeValidation";

export function FlightLeg({
    leg,
    index,
    onUpdate,
    onRemove,
    canRemove,
    mockAirports,
}) {
    useTimeValidation({
        departureTime: leg.departure_time || "",
        arrivalTime: leg.arrival_time || "",
        departureDayOffset: leg.departure_day_offset || 0,
        arrivalDayOffset: leg.arrival_day_offset || 0,
    });

    const handleFactorChange = (type, value) => {
        onUpdate(index, `${type}_factor`, value);
    };

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Leg {index + 1}</h4>
                {canRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => onRemove(index)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm">Source Airport</Label>
                        <AutocompleteInput
                            value={
                                typeof leg.source_airport_name === "object"
                                    ? leg.source_airport_name.name
                                    : leg.source_airport_name || ""
                            }
                            onChange={(val, id) =>
                                onUpdate(index, "source_airport_name", val, id)
                            }
                            options={mockAirports}
                            placeholder="Select source airport"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm">Destination Airport</Label>
                        <AutocompleteInput
                            value={
                                typeof leg.destination_airport_name === "object"
                                    ? leg.destination_airport_name.name
                                    : leg.destination_airport_name || ""
                            }
                            onChange={(val, id) =>
                                onUpdate(
                                    index,
                                    "destination_airport_name",
                                    val,
                                    id
                                )
                            }
                            options={mockAirports}
                            placeholder="Select destination airport"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label className="text-sm">Departure Time</Label>
                        <Input
                            type="time"
                            value={leg.departure_time || ""}
                            onChange={(e) =>
                                onUpdate(
                                    index,
                                    "departure_time",
                                    e.target.value
                                )
                            }
                            required
                            className=" border border-amber-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm">Arrival Time</Label>
                        <Input
                            type="time"
                            value={leg.arrival_time || ""}
                            onChange={(e) =>
                                onUpdate(index, "arrival_time", e.target.value)
                            }
                            required
                            className=" border border-amber-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm">Departure Day Offset</Label>
                        <Input
                            type="number"
                            value={leg.departure_day_offset}
                            onChange={(e) =>
                                onUpdate(
                                    index,
                                    "departure_day_offset",
                                    Number.parseInt(e.target.value) || 0
                                )
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm">Arrival Day Offset</Label>
                        <Input
                            type="number"
                            value={leg.arrival_day_offset}
                            onChange={(e) =>
                                onUpdate(
                                    index,
                                    "arrival_day_offset",
                                    Number.parseInt(e.target.value) || 0
                                )
                            }
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-sm">Price</Label>
                    <Input
                        type="number"
                        step="0.01"
                        value={leg.price || ""}
                        onChange={(e) =>
                            onUpdate(index, "price", e.target.value)
                        }
                        placeholder="Base price"
                        required
                        className="max-w-xs"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-sm font-medium">
                        Class Price Factors
                    </Label>
                    <ClassPriceFactors
                        economyFactor={leg.economy_factor}
                        premiumFactor={leg.premium_factor}
                        businessFactor={leg.business_factor}
                        onFactorChange={handleFactorChange}
                    />
                </div>
            </div>
        </Card>
    );
}
