import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { ClassPriceFactors } from "../Admin/ClassPriceFactor";
import { AutocompleteInput } from "../Admin/AutoCompleteInput";
import { useTimeValidation } from "../Admin/TimeValidation";

export function FlightForm({ formData, onFormDataChange }) {
    const handleInputChange = (fieldName, value) => {
        const newData = { ...formData, [fieldName]: value };
        onFormDataChange(newData);
    };

    const handleFactorChange = (type, value) => {
        const newData = { ...formData, [`${type}_factor`]: value };
        onFormDataChange(newData);
    };

    useTimeValidation({
        departureTime: formData.departure_datetime
            ? new Date(formData.departure_datetime).toTimeString().slice(0, 5)
            : "",
        arrivalTime: formData.arrival_datetime
            ? new Date(formData.arrival_datetime).toTimeString().slice(0, 5)
            : "",
        departureDayOffset: 0,
        arrivalDayOffset: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Creating flight:", formData);
        alert(
            `Flight data ready for backend: ${JSON.stringify(
                formData,
                null,
                2
            )}`
        );
    };

    return (
        <div className="p-4 md:p-6 max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="flight_number"
                            className="text-sm font-medium"
                        >
                            Flight Number
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="flight_number"
                            value={formData.flight_number || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "flight_number",
                                    e.target.value
                                )
                            }
                            placeholder="Enter flight number"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="departure_airport"
                            className="text-sm font-medium"
                        >
                            Departure Airport
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <AutocompleteInput
                            value={formData.departure_airport || ""}
                            onChange={(value) =>
                                handleInputChange("departure_airport", value)
                            }
                            placeholder="Enter departure airport name"
                            getSuggestions={(query) =>
                                [
                                    "John F. Kennedy International Airport",
                                    "Los Angeles International Airport",
                                    "Chicago O'Hare International Airport",
                                    "Dallas/Fort Worth International Airport",
                                    "Denver International Airport",
                                ].filter((airport) =>
                                    airport
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                                )
                            }
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="arrival_airport"
                            className="text-sm font-medium"
                        >
                            Arrival Airport
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <AutocompleteInput
                            value={formData.arrival_airport || ""}
                            onChange={(value) =>
                                handleInputChange("arrival_airport", value)
                            }
                            placeholder="Enter arrival airport name"
                            getSuggestions={(query) =>
                                [
                                    "John F. Kennedy International Airport",
                                    "Los Angeles International Airport",
                                    "Chicago O'Hare International Airport",
                                    "Dallas/Fort Worth International Airport",
                                    "Denver International Airport",
                                ].filter((airport) =>
                                    airport
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                                )
                            }
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="departure_datetime"
                            className="text-sm font-medium"
                        >
                            Departure Date & Time
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="departure_datetime"
                            type="datetime-local"
                            value={formData.departure_datetime || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "departure_datetime",
                                    e.target.value
                                )
                            }
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="arrival_datetime"
                            className="text-sm font-medium"
                        >
                            Arrival Date & Time
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="arrival_datetime"
                            type="datetime-local"
                            value={formData.arrival_datetime || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "arrival_datetime",
                                    e.target.value
                                )
                            }
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price" className="text-sm font-medium">
                            Base Price
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="price"
                            type="number"
                            step="0.01"
                            value={formData.price || ""}
                            onChange={(e) =>
                                handleInputChange(
                                    "price",
                                    Number.parseFloat(e.target.value) || 0
                                )
                            }
                            placeholder="Enter base price"
                            required
                            className="w-full"
                        />
                    </div>

                    <div className="md:col-span-2 xl:col-span-3">
                        <ClassPriceFactors
                            economyFactor={formData.economy_factor || 1.2}
                            premiumFactor={formData.premium_factor || 2}
                            businessFactor={formData.business_factor || 3.5}
                            onFactorChange={handleFactorChange}
                        />
                    </div>
                </div>

                {Object.keys(formData).length > 0 && (
                    <Card className="mt-6">
                        <CardContent className="pt-6">
                            <h3 className="text-sm font-medium mb-2">
                                Current Form Data:
                            </h3>
                            <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-60">
                                {JSON.stringify(formData, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" className="w-full md:w-auto md:px-8">
                    Create Flight
                </Button>
            </form>
        </div>
    );
}
