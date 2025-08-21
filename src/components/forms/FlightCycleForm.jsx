import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Plus } from "lucide-react";
import { AutocompleteInput } from "../Admin/AutoCompleteInput";
import { FlightLeg } from "../Admin/FlightLeg";
import { toast } from "sonner";

const mockAirports = [
    {
        id: "22fd6d3f-cdf1-42f0-9049-9b212cd7f4f6",
        name: "John F. Kennedy International Airport",
    },
    { id: "79461ea1-6b8f-46e3-9a8d-48c7870ca391", name: "Heathrow Airport" },
    {
        id: "5a529a7e-d1be-498e-82bf-a4e1a2deb225",
        name: "Charles de Gaulle Airport",
    },
];

export function FlightCycleForm({ formData, onFormDataChange }) {
    const [legs, setLegs] = useState([]);
    const [airplanes, setAirplanes] = useState([]);
    const [form, setForm] = useState({});

    

    useEffect(() => {
        if (legs.length > 0) {
            const maxOffset = Math.max(
                ...legs.map((leg) =>
                    Math.max(
                        leg.departure_day_offset || 0,
                        leg.arrival_day_offset || 0
                    )
                )
            );
            const totalDays = maxOffset + 1;

            const updatedData = {
                ...formData,
                legs: legs,
                total_days: totalDays,
            };
            onFormDataChange(updatedData);
        }
    }, [legs]);

    const handleAirplaneChange = async (name) => {
        try {
            let res = await fetch(
                `${
                    import.meta.env.VITE_BACKEND_URL
                }/flight/airplane/airplane/search/${name}`,
                {
                    credentials: "include",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            res = await res.json();
            if (!res.ok) toast(res.message);
            setAirplanes(res.data);
        } catch (error) {
            toast(error.message);
        }
    };

    const handleInputChange = (fieldName, value, selectedId) => {
        let finalValue = value;

        if (selectedId && fieldName === "airplane_name") {
            finalValue = { name: value, id: selectedId };
        }

        const newData = { ...formData, [fieldName]: finalValue };
        onFormDataChange(newData);
    };

    const addLeg = () => {
        const newLeg = {
            source_airport_name: "",
            destination_airport_name: "",
            departure_time: "",
            arrival_time: "",
            departure_day_offset: 0,
            arrival_day_offset: 0,
            price: "",
            economy_factor: 1.2,
            premium_factor: 2,
            business_factor: 3.5,
        };
        setLegs([...legs, newLeg]);
    };

    const removeLeg = (index) => {
        const newLegs = legs.filter((_, i) => i !== index);
        setLegs(newLegs);
    };

    const updateLeg = (index, field, value, selectedId) => {
        const newLegs = [...legs];

        if (selectedId && field.includes("airport")) {
            newLegs[index] = {
                ...newLegs[index],
                [field]: { name: value, id: selectedId },
            };
        } else {
            newLegs[index] = { ...newLegs[index], [field]: value };
        }

        setLegs(newLegs);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const backendData = { ...formData };

        // Transform airplane_name to airplane_id for backend
        if (
            typeof backendData.airplane_name === "object" &&
            backendData.airplane_name?.id
        ) {
            backendData.airplane_id = backendData.airplane_name.id;
            delete backendData.airplane_name;
        }

        if (legs.length > 0) {
            const transformedLegs = legs.map((leg) => ({
                source_airport_id:
                    leg.source_airport_name?.id || leg.source_airport_name,
                destination_airport_id:
                    leg.destination_airport_name?.id ||
                    leg.destination_airport_name,
                departure_time: leg.departure_time,
                arrival_time: leg.arrival_time,
                departure_day_offset: leg.departure_day_offset.toString(),
                arrival_day_offset: leg.arrival_day_offset.toString(),
                price: leg.price,
                class_price_factor: {
                    economy: leg.economy_factor,
                    premium: leg.premium_factor,
                    business: leg.business_factor,
                },
            }));

            backendData.legs = transformedLegs;
        }

        console.log("Creating flight_cycle:", backendData);
    };

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-2">
                        <Label
                            htmlFor="airplane_name"
                            className="text-sm font-medium"
                        >
                            Airplane
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <AutocompleteInput
                            value={
                                typeof formData.airplane_name === "object"
                                    ? formData.airplane_name.name
                                    : formData.airplane_name || ""
                            }
                            onChange={(val, id) => {
                                if (val) handleAirplaneChange(val);
                                else setAirplanes([]);
                                handleInputChange("airplane_name", val, id);
                            }}
                            options={airplanes}
                            placeholder="Enter airplane name"
                            required={true}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="start_date"
                            className="text-sm font-medium"
                        >
                            Start Date
                            <span className="text-destructive ml-1">*</span>
                        </Label>
                        <Input
                            id="start_date"
                            type="date"
                            value={formData.start_date || ""}
                            onChange={(e) =>
                                handleInputChange("start_date", e.target.value)
                            }
                            required
                            className="w-full border border-amber-800"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="total_days"
                            className="text-sm font-medium"
                        >
                            Total Days
                        </Label>
                        <Input
                            id="total_days"
                            type="number"
                            value={formData.total_days || ""}
                            onChange={(e) =>
                                handleInputChange("total_days", e.target.value)
                            }
                            placeholder="Auto-calculated from leg offsets"
                            className="bg-muted w-full"
                            readOnly
                            title="Auto-calculated from leg offsets"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Flight Legs</h3>
                        <Button
                            type="button"
                            onClick={addLeg}
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Leg
                        </Button>
                    </div>

                    {legs.map((leg, index) => (
                        <FlightLeg
                            key={index}
                            leg={leg}
                            index={index}
                            onUpdate={updateLeg}
                            onRemove={removeLeg}
                            canRemove={legs.length > 1}
                            mockAirports={mockAirports}
                        />
                    ))}

                    {legs.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>
                                No legs added yet. Click "Add Leg" to start
                                building your flight cycle.
                            </p>
                        </div>
                    )}
                </div>

                {/* {Object.keys(formData).length > 0 && (
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
                )} */}

                <Button type="submit" className="w-full">
                    Create Flight Cycle
                </Button>
            </form>
        </div>
    );
}
